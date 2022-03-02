import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { Box, Button, Grid, Hidden } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import FilterListIcon from '@material-ui/icons/FilterList';
import AddIcon from '@material-ui/icons/Add';
import { HandleApiResponse } from '../../../_shared/components';
import {
  AddProspectModal,
  ApprovedItemModal,
  ProspectListCard,
  RefreshProspectsModal,
  RejectItemModal,
  ScheduledSurfaceGroupedList,
  ScheduleItemModal,
  SplitButton,
} from '../../components';
import {
  ApprovedCuratedCorpusItem,
  CuratedStatus,
  Prospect,
  RejectProspectMutationVariables,
  ScheduledCuratedCorpusItemsResult,
  useCreateApprovedCuratedCorpusItemMutation,
  useCreateScheduledCuratedCorpusItemMutation,
  useGetProspectsQuery,
  useGetScheduledItemsQuery,
  useGetScheduledSurfacesForUserQuery,
  useRejectProspectMutation,
  useUpdateProspectAsCuratedMutation,
  useUploadApprovedCuratedCorpusItemImageMutation,
} from '../../../api/generatedTypes';
import {
  useNotifications,
  useRunMutation,
  useToggle,
} from '../../../_shared/hooks';
import {
  downloadAndUploadApprovedItemImageToS3,
  transformProspectToApprovedItem,
} from '../../helpers/helperFunctions';
import { getProspectFilterOptions } from '../../helpers/getProspectFilterOptions';
import { FormikHelpers, FormikValues } from 'formik';
import { DropdownOption } from '../../helpers/definitions';
import { EmptyState } from './EmptyState';

export const ProspectingPage: React.FC = (): JSX.Element => {
  // set up the initial scheduled surface guid value (nothing at this point)
  const [currentScheduledSurfaceGuid, setCurrentScheduledSurfaceGuid] =
    useState('');

  // Why not set up the options we'll feed to the Scheduled Surface dropdown as well
  // at the same time?
  const [scheduledSurfaceOptions, setScheduledSurfaceOptions] = useState<
    DropdownOption[]
  >([]);

  // Ditto for the prospect filters dropdown - it depends on which Scheduled Surface you're on.
  const [prospectFilters, setProspectFilters] = useState<DropdownOption[]>([]);

  // Get the list of Scheduled Surfaces the currently logged-in user has access to.
  const { data: scheduledSurfaceData } = useGetScheduledSurfacesForUserQuery();

  // Once the data is ready, populate the values for current Scheduled Surface GUID
  // and the dropdown options.
  useEffect(() => {
    if (scheduledSurfaceData) {
      const options = scheduledSurfaceData.getScheduledSurfacesForUser.map(
        (scheduledSurface) => {
          return { code: scheduledSurface.guid, name: scheduledSurface.name };
        }
      );
      if (options.length > 0) {
        setCurrentScheduledSurfaceGuid(options[0].code);
        setScheduledSurfaceOptions(options);
      }

      // Populate the Prospect Type filtering dropdown with values
      // relevant to this Scheduled Surface.
      if (scheduledSurfaceData.getScheduledSurfacesForUser[0]) {
        const filters = getProspectFilterOptions(
          scheduledSurfaceData.getScheduledSurfacesForUser[0].prospectTypes
        );
        setProspectFilters(filters);
      }
    }
  }, [scheduledSurfaceData]);

  // set up initial start/end dates for the query
  const startDate = DateTime.local().toFormat('yyyy-MM-dd');
  const endDate = DateTime.local().plus({ days: 1 }).toFormat('yyyy-MM-dd');

  /**
   * When the user selects another Scheduled Surface from the "I am curating for..."
   * dropdown, refetch all the data on the page for that surface.
   * This includes relevant prospects, prospect types, and the scheduled items
   * on the sidebar.
   */
  const updateScheduledSurface = (option: DropdownOption) => {
    // fetch prospects for the selected Scheduled Surface
    refetch({ scheduledSurfaceGuid: option.code });

    // fetch scheduled items for the selected Scheduled Surface
    refetchScheduled({
      filters: {
        scheduledSurfaceGuid: currentScheduledSurfaceGuid,
        endDate,
        startDate,
      },
    });

    // Update the split button to reflect which ScheduledSurface the user is now on.
    setCurrentScheduledSurfaceGuid(option.code);

    // Get the relevant Scheduled Surface object out of the list of all surfaces
    // we fetched earlier for the user.
    const currentScheduledSurface =
      scheduledSurfaceData?.getScheduledSurfacesForUser.filter(
        (surface) => surface.guid === option.code
      )[0];

    // Update the Prospect Type dropdown with values available
    // for the current Scheduled Surface
    const filterOptions = getProspectFilterOptions(
      currentScheduledSurface?.prospectTypes!
    );
    setProspectFilters(filterOptions);
  };

  // Get a list of prospects on the page
  const { loading, error, data, refetch } = useGetProspectsQuery({
    // Do not cache prospects at all. On update, remove the relevant prospect
    // card from the screen manually once the prospect has been curated.
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    variables: { scheduledSurfaceGuid: currentScheduledSurfaceGuid },
  });

  // Get today and tomorrow's items that are already scheduled for this Scheduled Surface
  const {
    loading: loadingScheduled,
    error: errorScheduled,
    data: dataScheduled,
    refetch: refetchScheduled,
  } = useGetScheduledItemsQuery({
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    variables: {
      filters: {
        scheduledSurfaceGuid: currentScheduledSurfaceGuid,
        startDate,
        endDate,
      },
    },
  });

  /**
   * Set the current Prospect to be worked on (e.g., to be approved or rejected).
   */
  const [currentItem, setCurrentItem] = useState<Prospect | undefined>(
    undefined
  );

  /**
   * Set the current Curated Item to be worked on (e.g., to add to Scheduled Surface optionally).
   */
  const [approvedItem, setApprovedItem] = useState<
    ApprovedCuratedCorpusItem | undefined
  >(undefined);

  const [isRecommendation, setIsRecommendation] = useState<boolean>(false);

  /**
   * Keep track of whether the "Reject this prospect" modal is open or not.
   */
  const [rejectModalOpen, toggleRejectModal] = useToggle(false);

  /**
   * Keep track of whether the "Edit Item" modal is open or not.
   */
  const [approvedItemModalOpen, toggleApprovedItemModal] = useToggle(false);

  /**
   * Keep track of whether the "Refresh Prospects" modal is open or not.
   */
  const [refreshProspectsModalOpen, toggleRefreshProspectsModal] =
    useToggle(false);

  /**
   * Keeps track of whether the "Add a New Prospect" modal is open or not.
   */
  const [addProspectModalOpen, toggleAddProspectModal] = useToggle(false);
  /**
   * Keep track of whether the "Schedule this item" modal is open or not.
   */
  const [scheduleModalOpen, toggleScheduleModal] = useToggle(false);

  // Get a helper function that will execute each mutation, show standard notifications
  // and execute any additional actions in a callback
  const { runMutation } = useRunMutation();

  // Prepare the "reject prospect" mutation
  const [rejectProspect] = useRejectProspectMutation();
  // Prepare the "update prospect as curated" mutation
  const [updateProspectAsCurated] = useUpdateProspectAsCuratedMutation();

  // Instead of working off Apollo Client's cache for the `getProspects` query
  // let's set up another variable for the prospect card list.
  const [prospects, setProspects] = useState<Prospect[]>([]);

  // When the batch of random prospects has loaded, update our `prospects` variable
  // with the contents of the API response. This will allow us to remove items from
  // the response array and unmount the relevant prospect cards when they have been
  // processed.
  useEffect(() => {
    setProspects(data?.getProspects!);
  }, [data]);

  // For filtering on prospects, we can pass additional variables to the `refetch()`
  // function.
  // Initially, set the filters to fetch prospects from all available sources.
  const [filterProspectsBy, setFilterProspectsBy] = useState<{
    prospectType?: string;
  }>({});

  /**
   * This is passed to the SplitButton component to execute on choosing a menu item
   * from the dropdown.
   */
  const updateFilters = (option: DropdownOption) => {
    setFilterProspectsBy(
      // Need to pass undefined when NOT filtering prospects here so that the filter
      // variable on prospect types resets;
      // otherwise the refetch() function is run with previously set filters
      // when users update filters from, for example, "Syndicated" to "All Sources".
      option.code ? { prospectType: option.code } : { prospectType: undefined }
    );
  };

  /**
   * Add the prospect to the rejected corpus.
   * Additionally, let Prospect API know the prospect has been processed.
   *
   * @param values
   * @param formikHelpers
   */
  const onRejectSave = (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ): void => {
    // Set out all the variables we need to pass to the first mutation
    const variables: RejectProspectMutationVariables = {
      data: {
        url: currentItem?.url,
        title: currentItem?.title,
        topic: currentItem?.topic ?? '',
        language: currentItem?.language,
        publisher: currentItem?.publisher,
        reason: values.reason,
      },
    };

    // Mark the prospect as processed in the Prospect API datastore.
    runMutation(
      updateProspectAsCurated,
      { variables: { prospectId: currentItem?.id } },
      undefined,
      () => {
        formikHelpers.setSubmitting(false);
      },
      () => {
        formikHelpers.setSubmitting(false);
      }
    );

    // Add the prospect to the rejected corpus
    runMutation(
      rejectProspect,
      { variables },
      `Item successfully added to the rejected corpus.`,
      () => {
        // Hide the modal
        toggleRejectModal();

        // Remove the newly rejected item from the list of prospects displayed
        // on the page.
        setProspects(
          prospects.filter((prospect) => prospect.id !== currentItem?.id!)
        );

        formikHelpers.setSubmitting(false);
      },
      () => {
        formikHelpers.setSubmitting(false);
      }
    );
  };

  // Prepare the create approved item mutation
  const [createApprovedItem] = useCreateApprovedCuratedCorpusItemMutation();

  // Prepare the upload approved item image mutation
  const [uploadApprovedItemImage] =
    useUploadApprovedCuratedCorpusItemImageMutation();

  // The toast notification hook
  const { showNotification } = useNotifications();

  // state variable to store s3 image url when user uploads a new image
  const [userUploadedS3ImageUrl, setUserUploadedS3ImageUrl] =
    useState<string>();

  /**
   *
   * This function gets called by the onCuratedItemSave function
   * it creates an approved item from a prospect and marks it as curated
   */
  const createApprovedItemAndMarkAsCurated = async (
    s3ImageUrl: string,
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ): Promise<void> => {
    //build an approved item

    const imageUrl: string = s3ImageUrl;

    const approvedItem = {
      prospectId: currentItem?.id!,
      url: values.url,
      title: values.title,
      excerpt: values.excerpt,
      status: values.curationStatus,
      language: values.language,
      publisher: values.publisher,
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
      (approvedItemData) => {
        // call the mutation to mark prospect as approved
        runMutation(
          updateProspectAsCurated,
          { variables: { prospectId: currentItem?.id } },
          undefined,
          () => {
            toggleApprovedItemModal();

            if (approvedItem.status === CuratedStatus.Recommendation) {
              setApprovedItem(approvedItemData.createApprovedCuratedCorpusItem);
              toggleScheduleModal();
            }

            // Remove the newly curated item from the list of prospects displayed
            // on the page.
            setProspects(
              prospects.filter((prospect) => prospect.id !== currentItem?.id!)
            );

            formikHelpers.setSubmitting(false);
          },
          () => {
            formikHelpers.setSubmitting(false);
          }
        );
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

      // create an approved item and mark the prospect as curated
      await createApprovedItemAndMarkAsCurated(
        s3ImageUrl,
        values,
        formikHelpers
      );
    } catch (error: any) {
      showNotification(error.message, 'error');
      return;
    }
  };

  // 1. Prepare the "schedule curated item" mutation
  const [scheduleCuratedItem] = useCreateScheduledCuratedCorpusItemMutation();
  // 2. Schedule the curated item when the user saves a scheduling request
  const onScheduleSave = (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ): void => {
    // Set out all the variables we need to pass to the mutation
    const variables = {
      approvedItemExternalId: approvedItem?.externalId,
      scheduledSurfaceGuid: values.scheduledSurfaceGuid,
      scheduledDate: values.scheduledDate.toISODate(),
    };

    // Run the mutation
    runMutation(
      scheduleCuratedItem,
      { variables },
      `Item scheduled successfully for ${values.scheduledDate.toLocaleString(
        DateTime.DATE_FULL
      )}`,
      () => {
        // Hide the loading indicator
        formikHelpers.setSubmitting(false);

        // Hide the Schedule Item Form modal
        toggleScheduleModal();

        // Refresh the sidebar if the story was scheduled for today or tomorrow
        if (
          [startDate, endDate].includes(
            values.scheduledDate.toFormat('yyyy-MM-dd')
          )
        ) {
          refetchScheduled();
        }
      },
      () => {
        // Hide the loading indicator
        formikHelpers.setSubmitting(false);
      }
    );
  };

  // check if no prospects are returned in the api call
  const showEmptyState = prospects && !loading && prospects.length === 0;

  return (
    <>
      {currentItem && (
        <>
          <RejectItemModal
            prospect={currentItem}
            isOpen={rejectModalOpen}
            onSave={onRejectSave}
            toggleModal={toggleRejectModal}
          />

          <ApprovedItemModal
            approvedItem={transformProspectToApprovedItem(
              currentItem,
              isRecommendation
            )}
            heading={isRecommendation ? 'Recommend' : 'Add to Corpus'}
            isOpen={approvedItemModalOpen}
            onSave={onCuratedItemSave}
            toggleModal={toggleApprovedItemModal}
            onImageSave={setUserUploadedS3ImageUrl}
          />
        </>
      )}

      <RefreshProspectsModal
        isOpen={refreshProspectsModalOpen}
        onConfirm={() => {
          refetch(filterProspectsBy);
          toggleRefreshProspectsModal();
        }}
        toggleModal={toggleRefreshProspectsModal}
      />
      <AddProspectModal
        isOpen={addProspectModalOpen}
        toggleModal={toggleAddProspectModal}
        approvedItem={approvedItem}
        setApprovedItem={setApprovedItem}
      />

      {approvedItem && (
        <ScheduleItemModal
          approvedItem={approvedItem}
          headingCopy="Optional: schedule this item"
          isOpen={scheduleModalOpen}
          scheduledSurfaceGuid={currentScheduledSurfaceGuid}
          onSave={onScheduleSave}
          toggleModal={toggleScheduleModal}
        />
      )}

      <h1>Prospecting</h1>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={9}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              {scheduledSurfaceOptions.length > 0 && (
                <>
                  I am prospecting for
                  <SplitButton
                    onMenuOptionClick={updateScheduledSurface}
                    options={scheduledSurfaceOptions}
                    size="small"
                  />
                </>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box display="flex" justifyContent="flex-end" mb={2}>
                <Button
                  color="default"
                  onClick={() => {
                    // toggle the add prospect modal
                    toggleAddProspectModal();
                  }}
                >
                  <AddIcon fontSize="large" />
                </Button>
                <Button
                  color="default"
                  onClick={() => {
                    // If all the prospects have been processed already,
                    // there is no need for a confirmation dialogue here,
                    // let's just fetch a new batch of prospects.
                    prospects && prospects.length > 0
                      ? toggleRefreshProspectsModal()
                      : refetch(filterProspectsBy);
                  }}
                >
                  <RefreshIcon fontSize="large" />
                </Button>

                {prospectFilters.length > 0 && (
                  <SplitButton
                    icon={<FilterListIcon fontSize="large" />}
                    onMenuOptionClick={updateFilters}
                    options={prospectFilters}
                    size="medium"
                  />
                )}
              </Box>
            </Grid>
          </Grid>

          {!prospects && <HandleApiResponse loading={loading} error={error} />}
          {showEmptyState && <EmptyState />}

          {prospects &&
            prospects.map((prospect) => {
              return (
                <ProspectListCard
                  key={prospect.id}
                  prospect={prospect}
                  onAddToCorpus={() => {
                    setCurrentItem(prospect);
                    setIsRecommendation(false);
                    toggleApprovedItemModal();
                  }}
                  onRecommend={() => {
                    setCurrentItem(prospect);
                    setIsRecommendation(true);
                    toggleApprovedItemModal();
                  }}
                  onReject={() => {
                    setCurrentItem(prospect);
                    toggleRejectModal();
                  }}
                />
              );
            })}
        </Grid>
        <Hidden xsDown>
          <Grid item sm={3}>
            <h4>Scheduled for today and tomorrow</h4>
            {!dataScheduled && (
              <HandleApiResponse
                loading={loadingScheduled}
                error={errorScheduled}
              />
            )}
            {dataScheduled &&
              dataScheduled.getScheduledCuratedCorpusItems.map(
                (data: ScheduledCuratedCorpusItemsResult) => (
                  <ScheduledSurfaceGroupedList
                    key={data.scheduledDate}
                    data={data}
                  />
                )
              )}
          </Grid>
        </Hidden>
      </Grid>
    </>
  );
};
