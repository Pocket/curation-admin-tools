import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { Box, Button, Grid, Hidden } from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import FilterListIcon from '@material-ui/icons/FilterList';
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import { HandleApiResponse } from '../../../_shared/components';
import {
  ApprovedItemModal,
  AddProspectModal,
  NewTabGroupedList,
  ProspectListCard,
  RefreshProspectsModal,
  RejectItemModal,
  ScheduleItemModal,
  SplitButton,
} from '../../components';
import { client } from '../../api/prospect-api/client';
import {
  Prospect,
  useGetProspectsQuery,
  useUpdateProspectAsCuratedMutation,
} from '../../api/prospect-api/generatedTypes';
import {
  ApprovedCuratedCorpusItem,
  CuratedStatus,
  RejectProspectMutationVariables,
  ScheduledCuratedCorpusItemsResult,
  useCreateApprovedCuratedCorpusItemMutation,
  useCreateNewTabFeedScheduledItemMutation,
  useGetNewTabsForUserQuery,
  useGetScheduledItemsQuery,
  useRejectProspectMutation,
  useUploadApprovedCuratedCorpusItemImageMutation,
} from '../../api/curated-corpus-api/generatedTypes';
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
  // set up the initial new tab guid value (nothing at this point)
  const [currentNewTabGuid, setCurrentNewTabGuid] = useState('');

  // Why not set up the options we'll feed to the New Tab dropdown as well
  // at the same time?
  const [newTabOptions, setNewTabOptions] = useState<DropdownOption[]>([]);

  // Ditto for the prospect filters dropdown - it depends on which New Tab you're on.
  const [prospectFilters, setProspectFilters] = useState<DropdownOption[]>([]);

  // Get the list of New Tabs the currently logged-in user has access to.
  const { data: newTabData } = useGetNewTabsForUserQuery();

  // Once the data is ready, populate the values for current New Tab Guid
  // and the dropdown options.
  useEffect(() => {
    if (newTabData) {
      const options = newTabData.getNewTabsForUser.map((newTab) => {
        return { code: newTab.guid, name: newTab.name };
      });
      setCurrentNewTabGuid(options[0].code);
      setNewTabOptions(options);

      // Populate the Prospect Type filtering dropdown with values
      // relevant to this New Tab.
      const filters = getProspectFilterOptions(
        newTabData.getNewTabsForUser[0].prospectTypes
      );
      setProspectFilters(filters);
    }
  }, [newTabData]);

  // set up initial start/end dates for the query
  const startDate = DateTime.local().toFormat('yyyy-MM-dd');
  const endDate = DateTime.local().plus({ days: 1 }).toFormat('yyyy-MM-dd');

  /**
   * When the user selects another New Tab from the "I am curating for..." dropdown,
   * refetch all the data on the page for that New Tab. That includes relevant
   * prospects, prospect types, and the scheduled items on the sidebar.
   */
  const updateNewTab = (option: DropdownOption) => {
    // fetch prospects for the selected New Tab
    refetch({ newTab: option.code });

    // fetch scheduled items for the selected New Tab
    refetchScheduled({
      filters: { newTabGuid: currentNewTabGuid, endDate, startDate },
    });

    // Update the split button to reflect which New Tab the user is now on.
    setCurrentNewTabGuid(option.code);

    // Get the relevant New Tab object out of the list of all new tabs
    // we fetched earlier for the user.
    const currentNewTab = newTabData?.getNewTabsForUser.filter(
      (newTab) => newTab.guid === option.code
    )[0];

    // Update the Prospect Type dropdown with values available
    // for the current New Tab.
    const filterOptions = getProspectFilterOptions(
      currentNewTab?.prospectTypes!
    );
    setProspectFilters(filterOptions);
  };

  // Get a list of prospects on the page
  const { loading, error, data, refetch } = useGetProspectsQuery({
    // Do not cache prospects at all. On update, remove the relevant prospect
    // card from the screen manually once the prospect has been curated.
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    variables: { newTab: currentNewTabGuid },
    client,
  });

  // Get today and tomorrow's items that are already scheduled for this New Tab
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
        newTabGuid: currentNewTabGuid,
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
   * Set the current Curated Item to be worked on (e.g., to add to New Tab optionally).
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

  //TODO: fix this
  /**
   * does the thing
   */
  const [addProspectModalOpen, toggleAddProspectModal] = useToggle(false);
  /**
   * Keep track of whether the "Schedule this item for New Tab" modal is open or not.
   */
  const [scheduleModalOpen, toggleScheduleModal] = useToggle(false);

  // Get a helper function that will execute each mutation, show standard notifications
  // and execute any additional actions in a callback
  const { runMutation } = useRunMutation();

  // Prepare the "reject prospect" mutation
  const [rejectProspect] = useRejectProspectMutation();
  // Prepare the "update prospect as curated" mutation
  const [updateProspectAsCurated] = useUpdateProspectAsCuratedMutation({
    client,
  });

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
        prospectId: currentItem?.id!,
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
      { variables: { prospectId: currentItem?.id }, client },
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
    const languageCode: string = values.language === 'English' ? 'en' : 'de';
    const curationStatus = values.curationStatus.toUpperCase();
    const topic: string = values.topic.toUpperCase();
    const imageUrl: string = s3ImageUrl;

    const approvedItem = {
      prospectId: currentItem?.id!,
      url: values.url,
      title: values.title,
      excerpt: values.excerpt,
      status: curationStatus,
      language: languageCode,
      publisher: values.publisher,
      imageUrl,
      topic,
      isCollection: values.collection,
      isTimeSensitive: values.timeSensitive,
      isSyndicated: values.syndicated,
    };

    // call the create approved item mutation
    runMutation(
      createApprovedItem,
      { variables: { data: { ...approvedItem } }, client },
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
  const [scheduleCuratedItem] = useCreateNewTabFeedScheduledItemMutation();
  // 2. Schedule the curated item when the user saves a scheduling request
  const onScheduleSave = (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ): void => {
    // Set out all the variables we need to pass to the mutation
    const variables = {
      approvedItemExternalId: approvedItem?.externalId,
      newTabGuid: values.newTabGuid,
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
        toggleScheduleModal();
        formikHelpers.setSubmitting(false);
      },
      () => {
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
      />

      {approvedItem && (
        <ScheduleItemModal
          approvedItem={approvedItem}
          headingCopy="Optional: schedule this item for New Tab"
          isOpen={scheduleModalOpen}
          onSave={onScheduleSave}
          toggleModal={toggleScheduleModal}
        />
      )}

      <h1>Prospecting</h1>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={9}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              {newTabOptions.length > 0 && (
                <>
                  I am prospecting for
                  <SplitButton
                    onMenuOptionClick={updateNewTab}
                    options={newTabOptions}
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
                  <LibraryAddIcon fontSize="large" />
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
            <h4>Scheduled for New Tab</h4>
            {!dataScheduled && (
              <HandleApiResponse
                loading={loadingScheduled}
                error={errorScheduled}
              />
            )}
            {dataScheduled &&
              dataScheduled.getScheduledCuratedCorpusItems.map(
                (data: ScheduledCuratedCorpusItemsResult) => (
                  <NewTabGroupedList key={data.scheduledDate} data={data} />
                )
              )}
          </Grid>
        </Hidden>
      </Grid>
    </>
  );
};
