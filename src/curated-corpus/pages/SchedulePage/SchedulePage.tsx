import React, { ReactElement, useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DateTime } from 'luxon';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { FormikHelpers, FormikValues } from 'formik';
import {
  Button,
  FloatingActionButton,
  HandleApiResponse,
} from '../../../_shared/components';
import {
  AddProspectModal,
  ApprovedItemModal,
  DuplicateProspectModal,
  EditCorpusItemAction,
  RejectAndUnscheduleItemAction,
  RemoveItemFromScheduledSurfaceModal,
  ScheduledItemCardWrapper,
  ScheduleItemModal,
  ScheduleSummaryLayout,
  SplitButton,
} from '../../components';
import {
  ApprovedCorpusItem,
  CorpusItemSource,
  CreateApprovedCorpusItemMutation,
  DeleteScheduledCorpusItemInput,
  Prospect,
  ScheduledCorpusItem,
  ScheduledCorpusItemsResult,
  ScheduledItemSource,
  useCreateApprovedCorpusItemMutation,
  useCreateScheduledCorpusItemMutation,
  useDeleteScheduledItemMutation,
  useGetScheduledItemsLazyQuery,
  useGetScheduledSurfacesForUserQuery,
  useRescheduleScheduledCorpusItemMutation,
  useUploadApprovedCorpusItemImageMutation,
} from '../../../api/generatedTypes';
import {
  useNotifications,
  useRunMutation,
  useToggle,
} from '../../../_shared/hooks';
import { DropdownOption } from '../../helpers/definitions';
import {
  downloadAndUploadApprovedItemImageToS3,
  getLocalDateTimeForGuid,
} from '../../helpers/helperFunctions';
import { curationPalette } from '../../../theme';
import { transformProspectToApprovedItem } from '../../helpers/prospects';
import { transformAuthors } from '../../../_shared/utils/transformAuthors';

export const SchedulePage: React.FC = (): ReactElement => {
  /**
   * ##########
   * ########## State variables start here
   * ##########
   */

  // set up initial start date. Note it is set a day after current local time
  const [startDate, setStartDate] = useState<DateTime>(
    DateTime.local().plus({ days: 1 })
  );

  // set up initial end date. Note it is set a day after startDate state variable
  const [endDate, setEndDate] = useState<DateTime>(
    DateTime.local().plus({ days: 2 })
  );

  // set up the initial Scheduled Surface GUID value (nothing at this point)
  const [currentScheduledSurfaceGuid, setCurrentScheduledSurfaceGuid] =
    useState('');

  // Why not set up the options we'll feed to the Scheduled Surface dropdown as well
  // at the same time?
  const [scheduledSurfaceOptions, setScheduledSurfaceOptions] = useState<
    DropdownOption[]
  >([]);

  /**
   * Set the current Scheduled Item to be worked on.
   */
  const [currentItem, setCurrentItem] = useState<
    Omit<ScheduledCorpusItem, '__typename'> | undefined
  >(undefined);

  // State variable to store the current local time for the currently selected scheduled surface
  const [guidLocalDateTime, setGuidLocalDateTime] = useState<
    string | undefined
  >();

  // Track which scheduled date to use by default when a curator
  // adds a new item manually.
  const [addItemDate, setAddItemDate] = useState<DateTime>();

  /**
   * ##########
   * ########## gql and other useful hooks start here
   * ##########
   */

  // Set up the toast message hook
  const { showNotification } = useNotifications();

  /**
   * Keep track of whether the "Remove this item" modal is open or not.
   */
  const [removeModalOpen, toggleRemoveModal] = useToggle(false);

  /**
   * Keep track of whether the "Schedule Item Modal" is open or not
   */
  const [scheduleItemModalOpen, toggleScheduleItemModal] = useToggle(false);

  /**
   * Keep track of whether the "Edit item modal" is open or not
   */
  const [editItemModalOpen, toggleEditModal] = useToggle(false);

  /**
   * Set the current Prospect to be worked on - this is used to manually add
   * a curated item.
   */
  const [currentProspect, setCurrentProspect] = useState<Prospect | undefined>(
    undefined
  );

  /**
   * Set the current Curated Item to be worked on (e.g., to add to Scheduled Surface).
   */
  const [approvedItem, setApprovedItem] = useState<
    ApprovedCorpusItem | undefined
  >(undefined);

  /**
   * Keep track of whether the "Edit Item" modal is open or not
   * in the manual addition workflow.
   */
  const [approvedItemModalOpen, toggleApprovedItemModal] = useToggle(false);

  /**
   * Another variable set during adding a new curated item manually.
   */
  const [isRecommendation, setIsRecommendation] = useState<boolean>(true);

  /**
   * The "add new item" workflow also needs this variable and setter.
   */
  const [isManualSubmission, setIsManualSubmission] = useState<boolean>(true);

  /**
   * Keeps track of whether the "Add a New Item" modal is open or not.
   */
  const [addProspectModalOpen, toggleAddProspectModal] = useToggle(false);

  /**
   * Keep track of whether the "Duplicate item" modal is open or not.
   */
  const [duplicateProspectModalOpen, toggleDuplicateProspectModal] =
    useToggle(false);

  /**
   * Keep track of whether the "Reject this item" modal is open or not.
   */
  const [rejectAndUnscheduleModalOpen, toggleRejectAndUnscheduleModal] =
    useToggle(false);

  // state variable to store s3 image url when user uploads a new image
  const [userUploadedS3ImageUrl, setUserUploadedS3ImageUrl] = useState<
    undefined | string
  >();

  // Get the list of Scheduled Surfaces the currently logged-in user has access to.
  const { data: scheduledSurfaceData } = useGetScheduledSurfacesForUserQuery({
    onCompleted: (data) => {
      const options = data.getScheduledSurfacesForUser.map(
        (scheduledSurface) => {
          return { code: scheduledSurface.guid, name: scheduledSurface.name };
        }
      );
      if (options.length > 0) {
        setCurrentScheduledSurfaceGuid(options[0].code);
      }
    },
  });

  // Get a helper function that will execute each mutation, show standard notifications
  // and execute any additional actions in a callback
  const { runMutation } = useRunMutation();

  // Prepare the "delete scheduled item" mutation
  const [deleteScheduledItem] = useDeleteScheduledItemMutation();

  // Prepare the "reschedule scheduled curated corpus item" mutation
  const [rescheduleItem] = useRescheduleScheduledCorpusItemMutation();

  // Prepare the create approved item mutation
  const [createApprovedItem] = useCreateApprovedCorpusItemMutation();

  // Prepare the upload approved item image mutation
  const [uploadApprovedItemImage] = useUploadApprovedCorpusItemImageMutation();

  /**
   * ##########
   * ########## useEffect and other functions start here
   * ##########
   */

  // Once the data is ready, populate the values for current Scheduled Surface GUID
  // and the dropdown options.
  useEffect(() => {
    if (scheduledSurfaceData) {
      const options = scheduledSurfaceData.getScheduledSurfacesForUser.map(
        (surface) => {
          return { code: surface.guid, name: surface.name };
        }
      );
      if (options.length > 0) {
        setCurrentScheduledSurfaceGuid(options[0].code);
        setScheduledSurfaceOptions(options);
      }
    }
  }, [scheduledSurfaceData]);

  // UseEffect hook that gets the scheduled items for the selected scheduled surface
  // has the currentScheduledSurfaceGuid as the dependency and initial execution is also on page load
  useEffect(() => {
    // check if the currentScheduledSurfaceGuid state variable is set first
    // due to non-sequential and async nature of react state updates, it causes the below query
    // to run with the incorrect value on page load intermittently
    if (currentScheduledSurfaceGuid) {
      executeGetScheduledItemsQuery(
        currentScheduledSurfaceGuid,
        startDate,
        endDate
      );
    }

    // show error toast for above query if any
    error && showNotification(error.message, 'error');

    // set local time for the scheduled surface on initial page load
    scheduledSurfaceData &&
      setGuidLocalDateTime(
        getLocalDateTimeForGuid(
          currentScheduledSurfaceGuid,
          scheduledSurfaceData
        )
      );
  }, [currentScheduledSurfaceGuid]);

  // Setting up the lazy query hook now that we need to execute
  // the query function on a button click after selecting the dates
  const [getScheduledItemsQuery, { loading, error, data, refetch }] =
    useGetScheduledItemsLazyQuery({
      fetchPolicy: 'no-cache',
      notifyOnNetworkStatusChange: true,
    });

  /**
   * When the user selects another Scheduled Surface from the "I am curating for..." dropdown,
   * refetch all the data on the page for that Scheduled Surface.
   */
  const updateScheduledSurface = (option: DropdownOption) => {
    // The "refetch" variable is only defined after the first execution
    // of a lazy query hook function
    if (refetch) {
      refetch({
        filters: {
          scheduledSurfaceGuid: option.code,
          startDate: startDate.toFormat('yyyy-MM-dd'),
          endDate: endDate.toFormat('yyyy-MM-dd'),
        },
      });
      setCurrentScheduledSurfaceGuid(option.code);

      scheduledSurfaceData &&
        setGuidLocalDateTime(
          getLocalDateTimeForGuid(option.code, scheduledSurfaceData)
        );
    }
  };

  /**
   * Reschedule item
   *
   * @param values
   * @param formikHelpers
   */
  const onRescheduleItem = (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ): void => {
    // DE items migrated from the old system don't have a topic. This check forces to add a topic before scheduling
    if (!currentItem?.approvedItem.topic) {
      showNotification('Cannot schedule item without topic', 'error');
      return;
    }

    // Set out all the variables we need to pass to the mutation
    const variables = {
      externalId: currentItem?.externalId,
      scheduledDate: values.scheduledDate.toISODate(),
      source: currentItem.source,
    };

    // Run the mutation
    runMutation(
      rescheduleItem,
      { variables },
      `Item rescheduled successfully.`,
      () => {
        toggleScheduleItemModal();
        formikHelpers.setSubmitting(false);
      },
      () => {
        formikHelpers.setSubmitting(false);
      },
      refetch
    );
  };

  /**
   * Pocket Hits items need to be returned in a pre-defined order. When the graph
   * is queried, scheduled items are returned sorted by the `updatedAt` value
   * in ascending order (most recently updated goes last).
   *
   * To enable the curators to rearrange stories in a certain order for a Pocket Hits
   * email, a "Move to bottom" button has been added that updates the scheduled entry
   * to bump up the timestamp recorded in the `updatedAt` field.
   * @param item
   */
  const moveItemToBottom = (item: ScheduledCorpusItem): void => {
    // Run the "reschedule" mutation with the same variables
    // it already has. All we want from it is to update `updatedAt` timestamp.
    const variables = {
      externalId: item.externalId,
      scheduledDate: item.scheduledDate,
      source: item.source,
    };

    // Run the mutation
    runMutation(
      rescheduleItem,
      { variables },
      `Success! Item moved to the bottom of the list.`,
      undefined,
      undefined,
      refetch
    );
  };

  /**
   * Remove item from Scheduled Surface.
   *
   * @param values
   * @param formikHelpers
   */
  const onRemoveSave = (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ): void => {
    // Setup the input
    const input: DeleteScheduledCorpusItemInput = {
      externalId: currentItem?.externalId as string,
      reasonComment: values.otherReason,
      reasons: values.removalReason,
    };
    // Run the mutation
    runMutation(
      deleteScheduledItem,
      { variables: { data: input } },
      `Item removed successfully.`,
      () => {
        toggleRemoveModal();
        formikHelpers.setSubmitting(false);
      },
      () => {
        formikHelpers.setSubmitting(false);
      },
      refetch
    );
  };

  /**
   * Function that wraps the getScheduledItemsQuery function
   * @param surfaceGuid
   * @param startDate
   * @param endDate
   */
  const executeGetScheduledItemsQuery = (
    surfaceGuid: string,
    startDate: DateTime,
    endDate: DateTime
  ) => {
    getScheduledItemsQuery({
      variables: {
        filters: {
          scheduledSurfaceGuid: surfaceGuid,
          startDate: startDate.toFormat('yyyy-MM-dd'),
          endDate: endDate.toFormat('yyyy-MM-dd'),
        },
      },
    });

    if (error) {
      showNotification(error.message, 'error');
    }
  };

  /**
   *
   * @param data
   * @returns Formatted day and syndicated count heading
   */
  const getDayAndSyndicatedCountHeading = (
    data: ScheduledCorpusItemsResult
  ): string => {
    return DateTime.fromFormat(data.scheduledDate, 'yyyy-MM-dd')
      .setLocale('en')
      .toLocaleString(DateTime.DATE_FULL)
      .concat(` (${data.syndicatedCount}/${data.totalCount} syndicated)`);
  };

  /**
   * This function gets called by the onCuratedItemSave function
   */
  const createCuratedItem = async (
    s3ImageUrl: string,
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ): Promise<void> => {
    //build an approved item

    const imageUrl: string = s3ImageUrl;

    const approvedItem = {
      prospectId: null,
      url: values.url,
      title: values.title,
      excerpt: values.excerpt,
      status: values.curationStatus,
      language: values.language,
      authors: transformAuthors(values.authors),
      publisher: values.publisher,
      source: values.source,
      imageUrl,
      topic: values.topic,
      isCollection: values.collection,
      isTimeSensitive: values.timeSensitive,
      isSyndicated: values.syndicated,
    };

    // call the create approved item mutation
    runMutation(
      createApprovedItem,
      { variables: { data: { ...approvedItem } } },
      'Item successfully added to the curated corpus.',
      (approvedItemData: CreateApprovedCorpusItemMutation) => {
        toggleApprovedItemModal();
        formikHelpers.setSubmitting(false);

        setApprovedItem(approvedItemData.createApprovedCorpusItem);
        // transition to scheduling it
        toggleScheduleItemModal();
      }
    );
  };

  /**
   *
   * This function gets called when the user saves(approves) a prospect
   */
  const onCuratedItemSave = async (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ) => {
    try {
      // set s3ImageUrl variable to the user uploaded s3 image url
      let s3ImageUrl = userUploadedS3ImageUrl;

      // if user uploaded s3 url does not exist
      // download the image from the publisher and upload it to s3
      if (!s3ImageUrl) {
        s3ImageUrl = await downloadAndUploadApprovedItemImageToS3(
          values.imageUrl,
          uploadApprovedItemImage
        );
      }

      // create an item
      await createCuratedItem(s3ImageUrl, values, formikHelpers);

      // reset the userUploadedS3ImageUrl state variable so that the
      // manually uploaded image from a previous item does not persist
      setUserUploadedS3ImageUrl(undefined);
    } catch (error: any) {
      showNotification(error.message, 'error');
      return;
    }
  };

  // 1. Prepare the "schedule curated item" mutation
  const [scheduleCuratedItem] = useCreateScheduledCorpusItemMutation();
  // 2. Schedule the curated item when the user saves a scheduling request
  const onScheduleSave = (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ): void => {
    // DE items migrated from the old system don't have a topic. This check forces to add a topic before scheduling
    if (!approvedItem?.topic) {
      showNotification('Cannot schedule item without topic', 'error');
      return;
    }
    let scheduledSource;
    if (approvedItem.source === CorpusItemSource.Ml) {
      scheduledSource = ScheduledItemSource.Ml;
    } else {
      scheduledSource = ScheduledItemSource.Manual;
    }
    // Set out all the variables we need to pass to the mutation
    const variables = {
      approvedItemExternalId: approvedItem?.externalId,
      scheduledSurfaceGuid: values.scheduledSurfaceGuid,
      scheduledDate: values.scheduledDate.toISODate(),
      source: scheduledSource,
    };

    // Run the mutation
    runMutation(
      scheduleCuratedItem,
      { variables },
      `Item scheduled successfully for ${values.scheduledDate
        .setLocale('en')
        .toLocaleString(DateTime.DATE_FULL)}`,
      () => {
        // Hide the loading indicator
        formikHelpers.setSubmitting(false);

        // Hide the Schedule Item Form modal
        toggleScheduleItemModal();
      },
      () => {
        // Hide the loading indicator
        formikHelpers.setSubmitting(false);
      },
      refetch
    );
  };

  return (
    <>
      <h1>Schedule</h1>

      {currentItem && (
        <>
          <RemoveItemFromScheduledSurfaceModal
            item={currentItem}
            isOpen={removeModalOpen}
            onSave={onRemoveSave}
            toggleModal={toggleRemoveModal}
          />
          <ScheduleItemModal
            approvedItem={currentItem.approvedItem}
            headingCopy={'Reschedule Item'}
            isOpen={scheduleItemModalOpen}
            toggleModal={toggleScheduleItemModal}
            onSave={onRescheduleItem}
            scheduledSurfaceGuid={currentScheduledSurfaceGuid}
          />
          <EditCorpusItemAction
            item={currentItem.approvedItem}
            modalOpen={editItemModalOpen}
            toggleModal={toggleEditModal}
            refetch={refetch}
          />
          <RejectAndUnscheduleItemAction
            item={currentItem}
            modalOpen={rejectAndUnscheduleModalOpen}
            toggleModal={toggleRejectAndUnscheduleModal}
            refetch={refetch}
          />
        </>
      )}

      <AddProspectModal
        isOpen={addProspectModalOpen}
        toggleModal={toggleAddProspectModal}
        toggleApprovedItemModal={toggleApprovedItemModal}
        toggleDuplicateProspectModal={toggleDuplicateProspectModal}
        setCurrentProspect={setCurrentProspect}
        setApprovedItem={setApprovedItem}
        setIsRecommendation={setIsRecommendation}
        setIsManualSubmission={setIsManualSubmission}
      />

      {currentProspect && (
        <ApprovedItemModal
          approvedItem={transformProspectToApprovedItem(
            currentProspect,
            isRecommendation,
            isManualSubmission
          )}
          heading={isRecommendation ? 'Recommend' : 'Add to Corpus'}
          isOpen={approvedItemModalOpen}
          onSave={onCuratedItemSave}
          toggleModal={toggleApprovedItemModal}
          onImageSave={setUserUploadedS3ImageUrl}
          isRecommendation={isRecommendation}
        />
      )}

      {approvedItem && (
        <ScheduleItemModal
          approvedItem={approvedItem}
          date={addItemDate}
          headingCopy="Schedule this item"
          isOpen={scheduleItemModalOpen}
          scheduledSurfaceGuid={currentScheduledSurfaceGuid}
          onSave={onScheduleSave}
          toggleModal={toggleScheduleItemModal}
        />
      )}

      {approvedItem && (
        <DuplicateProspectModal
          approvedItem={approvedItem}
          isOpen={duplicateProspectModalOpen}
          toggleModal={toggleDuplicateProspectModal}
        />
      )}

      {scheduledSurfaceOptions.length > 0 && (
        <Grid container spacing={2}>
          <Grid item>
            <Grid item>
              View schedule for:
              <SplitButton
                onMenuOptionClick={updateScheduledSurface}
                options={scheduledSurfaceOptions}
                size="small"
              />
            </Grid>
            <Grid item>
              <Typography variant="h6">{guidLocalDateTime}</Typography>
            </Grid>
          </Grid>
          <Grid item>
            <LocalizationProvider dateAdapter={AdapterLuxon}>
              <Grid container spacing={2} alignItems="center">
                <Grid item sm>
                  <DatePicker
                    label="Start date"
                    inputFormat="MMMM d, yyyy"
                    value={startDate}
                    onChange={(date) => {
                      date && setStartDate(date);
                    }}
                    openTo="day"
                    renderInput={(params: any) => (
                      <TextField
                        fullWidth
                        size="small"
                        variant="outlined"
                        id="scheduled-start-date"
                        {...params}
                      />
                    )}
                  />
                </Grid>
                <Grid item sm>
                  <DatePicker
                    label="End date"
                    inputFormat="MMMM d, yyyy"
                    value={endDate}
                    onChange={(date) => {
                      date && setEndDate(date);
                    }}
                    openTo="day"
                    maxDate={startDate.plus({ days: 365 })}
                    renderInput={(params: any) => (
                      <TextField
                        fullWidth
                        size="small"
                        variant="outlined"
                        id="scheduled-end-date"
                        {...params}
                      />
                    )}
                  />
                </Grid>
                <Grid item>
                  <Button
                    buttonType="positive"
                    fullWidth
                    onClick={() => {
                      executeGetScheduledItemsQuery(
                        currentScheduledSurfaceGuid,
                        startDate,
                        endDate
                      );
                    }}
                  >
                    Get schedule
                  </Button>
                </Grid>
              </Grid>
            </LocalizationProvider>
          </Grid>
        </Grid>
      )}

      {/** Page Contents Below */}

      <Grid container spacing={2}>
        {!data && (
          <Grid item xs={12}>
            <HandleApiResponse loading={loading} error={error} />
          </Grid>
        )}

        <Grid item xs={12}>
          {data &&
            data.getScheduledCorpusItems.map(
              (data: ScheduledCorpusItemsResult) => (
                <Grid
                  container
                  alignItems="stretch"
                  spacing={3}
                  justifyContent="flex-start"
                  key={data.scheduledDate}
                >
                  <Grid item xs={10}>
                    <Box mt={3}>
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          sx={{ maxHeight: '2.5rem' }}
                        >
                          <Typography
                            sx={{
                              fontSize: '1.25rem',
                              fontWeight: 500,
                              textTransform: 'capitalize',
                              color: curationPalette.primary,
                            }}
                          >
                            {getDayAndSyndicatedCountHeading(data)}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <ScheduleSummaryLayout scheduledItems={data.items} />
                        </AccordionDetails>
                      </Accordion>
                    </Box>
                  </Grid>
                  <Grid item xs={2}>
                    <Box mt={3}>
                      <Button
                        size="large"
                        onClick={() => {
                          // toggle the add prospect modal
                          toggleAddProspectModal();
                          // set the default date to use when this manual addition
                          // is scheduled
                          setAddItemDate(
                            DateTime.fromFormat(
                              data.scheduledDate,
                              'yyyy-MM-dd'
                            )
                          );
                        }}
                      >
                        <AddIcon />
                        Add Item
                      </Button>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      {data.items.map((item: ScheduledCorpusItem) => {
                        return (
                          <ScheduledItemCardWrapper
                            key={item.externalId}
                            item={item}
                            onEdit={() => {
                              setCurrentItem(item);
                              toggleEditModal();
                            }}
                            onUnschedule={() => {
                              setCurrentItem(item);
                              toggleRemoveModal();
                            }}
                            onMoveToBottom={() => {
                              moveItemToBottom(item);
                            }}
                            onReschedule={() => {
                              setCurrentItem(item);
                              toggleScheduleItemModal();
                            }}
                            onReject={() => {
                              setCurrentItem(item);

                              // If this item is also scheduled elsewhere, show an error.
                              if (
                                item.approvedItem.scheduledSurfaceHistory
                                  .length > 1
                              ) {
                                showNotification(
                                  'Cannot reject and unschedule this item - multiple scheduled entries exist.',
                                  'error'
                                );
                              }
                              // Otherwise, proceed with rejecting and unscheduling this item
                              else {
                                toggleRejectAndUnscheduleModal();
                              }
                            }}
                            currentScheduledDate={data.scheduledDate}
                            scheduledSurfaceGuid={currentScheduledSurfaceGuid}
                          />
                        );
                      })}
                    </Grid>
                  </Grid>
                </Grid>
              )
            )}
        </Grid>
        <FloatingActionButton
          onClick={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </Grid>
    </>
  );
};
