import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { Box, Button, Grid, Hidden } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';

import { curationPalette } from '../../../theme';
import { HandleApiResponse } from '../../../_shared/components';
import {
  AddProspectModal,
  ApprovedItemModal,
  DuplicateProspectModal,
  ExistingProspectCard,
  ProspectListCard,
  ProspectFilters,
  RefreshProspectsModal,
  RejectItemModal,
  ScheduleItemModal,
  SidebarWrapper,
  SplitButton,
} from '../../components';
import {
  ActionScreen,
  ApprovedCorpusItem,
  CreateApprovedCorpusItemMutation,
  CuratedStatus,
  Prospect,
  RejectProspectMutationVariables,
  ActivitySource,
  useCreateApprovedCorpusItemMutation,
  useCreateScheduledCorpusItemMutation,
  useGetProspectsLazyQuery,
  useGetScheduledSurfacesForUserQuery,
  useRejectProspectMutation,
  useUpdateProspectAsCuratedMutation,
  useUploadApprovedCorpusItemImageMutation,
} from '../../../api/generatedTypes';
import {
  useNotifications,
  useRunMutation,
  useToggle,
} from '../../../_shared/hooks';
import { downloadAndUploadApprovedItemImageToS3 } from '../../helpers/helperFunctions';
import {
  getFilteredProspects,
  getProspectFilterOptions,
  transformProspectToApprovedItem,
} from '../../helpers/prospects';
import { FormikHelpers, FormikValues } from 'formik';
import { DropdownOption } from '../../helpers/definitions';
import { EmptyState } from './EmptyState';
import { transformAuthors } from '../../../_shared/utils/transformAuthors';
import { getDisplayTopic } from '../../helpers/topics';
import { ProspectFilerOptions } from '../../components/ProspectFilters/ProspectFilters';

const distantPast = new Date('1970-01-01Z00:00:00:000').getTime();

export const ProspectingPage: React.FC = (): JSX.Element => {
  const initialProspectFiltersState: ProspectFilerOptions = {
    topics: 'All',
  };
  const [prospectMetadataFilters, setProspectMetadataFilters] =
    useState<ProspectFilerOptions>(initialProspectFiltersState);

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

  // This is the date used in the sidebar. Defaults to tomorrow
  const [sidebarDate, setSidebarDate] = useState<DateTime | null>(
    DateTime.local().plus({ days: 1 }),
  );

  // Whether the data in the sidebar needs to be refreshed.
  // Is needed when the user switches from surface to surface or
  // when they schedule something for the date chosen in the sidebar.
  const [refreshSidebarData, setRefreshSidebarData] = useState(false);

  // Get a list of prospects on the page
  const [callGetProspectsQuery, { loading, error, data, refetch }] =
    useGetProspectsLazyQuery({
      // Do not cache prospects at all. On update, remove the relevant prospect
      // card from the screen manually once the prospect has been curated.
      fetchPolicy: 'no-cache',
      notifyOnNetworkStatusChange: true,
      variables: {
        scheduledSurfaceGuid: currentScheduledSurfaceGuid,
        historyFilter: {
          limit: 3,
          scheduledSurfaceGuid: currentScheduledSurfaceGuid,
        },
      },
      onCompleted: (data) => {
        // after this query has finished fetching, if no data and no errors returned
        // show empty state
        if (!data && !error) {
          setShowEmptyState(true);
        }
      },
    });

  // Get the list of Scheduled Surfaces the currently logged-in user has access to.
  const {
    data: scheduledSurfaceData,
    loading: scheduledSurfaceLoading,
    error: scheduledSurfaceError,
  } = useGetScheduledSurfacesForUserQuery({
    onCompleted: (data) => {
      const options = data.getScheduledSurfacesForUser.map(
        (scheduledSurface) => {
          return { code: scheduledSurface.guid, name: scheduledSurface.name };
        },
      );
      if (options.length > 0) {
        setCurrentScheduledSurfaceGuid(options[0].code);
        setScheduledSurfaceOptions(options);
      }

      // Populate the Prospect Type filtering dropdown with values
      // relevant to this Scheduled Surface.
      if (data.getScheduledSurfacesForUser[0]) {
        const filters = getProspectFilterOptions(
          data.getScheduledSurfacesForUser[0].prospectTypes,
        );
        setProspectFilters(filters);
      }
      // call the dependent queries now
      callGetProspectsQuery();
    },
  });

  /**
   * When the user selects another Scheduled Surface from the "I am curating for..."
   * dropdown, refetch all the data on the page for that surface.
   * This includes relevant prospects, prospect types, and the scheduled items
   * on the sidebar.
   */
  const updateScheduledSurface = (option: DropdownOption) => {
    // fetch prospects for the selected Scheduled Surface
    refetch && refetch({ scheduledSurfaceGuid: option.code });

    // Update the split button to reflect which ScheduledSurface the user is now on.
    setCurrentScheduledSurfaceGuid(option.code);

    // Reset the `isManualSubmission` state var as the user has moved to a different
    // scheduled surface
    setIsManualSubmission(false);

    // Get the relevant ScheduledSurface object out of the list of all surfaces
    // we fetched earlier for the user.
    const currentScheduledSurface =
      scheduledSurfaceData?.getScheduledSurfacesForUser.filter(
        (surface) => surface.guid === option.code,
      )[0];

    // Update the Prospect Type dropdown with values available
    // for the current Scheduled Surface
    const filterOptions = getProspectFilterOptions(
      currentScheduledSurface?.prospectTypes!,
    );
    setProspectFilters(filterOptions);
  };

  /**
   * Set the current Prospect to be worked on (e.g., to be approved or rejected).
   */
  const [currentProspect, setCurrentProspect] = useState<Prospect | undefined>(
    undefined,
  );

  /**
   * Set the current Curated Item to be worked on (e.g., to add to Scheduled Surface optionally).
   */
  const [approvedItem, setApprovedItem] = useState<
    ApprovedCorpusItem | undefined
  >(undefined);

  const [isRecommendation, setIsRecommendation] = useState<boolean>(false);

  /**
   * Set the boolean state variable to track if the prospect is manual
   */
  const [isManualSubmission, setIsManualSubmission] = useState<boolean>(false);

  /**
   * Set a state variable to track whether the Scheduled Surface dropdown on the
   * "Schedule this item" form should be locked to the current
   * scheduled surface.
   */
  const [disableScheduledSurface, setDisableScheduledSurface] =
    useState<boolean>(false);

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

  /**
   * Keep track of whether the "Duplicate item" modal is open or not.
   */
  const [duplicateProspectModalOpen, toggleDuplicateProspectModal] =
    useToggle(false);

  // Get a helper function that will execute each mutation, show standard notifications
  // and execute any additional actions in a callback
  const { runMutation } = useRunMutation();

  // Prepare the "reject prospect" mutation
  const [rejectProspect] = useRejectProspectMutation();
  // Prepare the "update prospect as curated" mutation
  const [updateProspectAsCurated] = useUpdateProspectAsCuratedMutation();

  // Instead of working off Apollo Client's cache for the `getProspects` query,
  // storing the prospects here which will be shown in the UI.
  const [prospects, setProspects] = useState<Prospect[]>([]);

  // Unsorted prospects. This represents our source of truth and what is received from the api call.
  // We use the above `prospects` state variable to render the UI.
  // NOTE: this state variable should NOT be mutated.
  const [unsortedProspects, setUnsortedProspects] = useState<Prospect[]>([]);

  // When the batch of random prospects has loaded, update our `unsortedProspects` variable
  // with the contents of the API response. This will allow us to remove items from
  // the response array and unmount the relevant prospect cards when they have been
  // processed.
  useEffect(() => {
    if (data) {
      const fetchedProspects = data.getProspects;
      setUnsortedProspects(fetchedProspects);

      // if both sort filters are unset(initial page load), render the received prospects and early exit
      if (!sortByPublishedDate && !sortByTimeToRead) {
        setProspects(fetchedProspects);
        return;
      }

      // if `sortByPublishedDate` is set, sort by published date
      sortByPublishedDate && handleSortByPublishedDate(fetchedProspects);

      // if `sortByTimeToRead` is set, sort by time to read
      sortByTimeToRead && handleSortByTimeToRead(fetchedProspects);
    }
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
      option.code ? { prospectType: option.code } : { prospectType: undefined },
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
    formikHelpers: FormikHelpers<any>,
  ): void => {
    // Set out all the variables we need to pass to the first mutation
    const variables: RejectProspectMutationVariables = {
      data: {
        url: currentProspect?.url,
        title: currentProspect?.title,
        topic: currentProspect?.topic ?? '',
        language: currentProspect?.language || undefined,
        publisher: currentProspect?.publisher,
        reason: values.reason,
        prospectId: currentProspect?.prospectId,
        actionScreen: ActionScreen.Prospecting,
      },
    };

    // Mark the prospect as processed in the Prospect API datastore.
    runMutation(
      updateProspectAsCurated,
      {
        variables: {
          id: currentProspect?.id,
          historyFilter: {
            limit: 1,
            scheduledSurfaceGuid: currentScheduledSurfaceGuid,
          },
        },
      },
      undefined,
      () => {
        formikHelpers.setSubmitting(false);
      },
      () => {
        formikHelpers.setSubmitting(false);
      },
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
          prospects.filter((prospect) => prospect.id !== currentProspect?.id!),
        );

        formikHelpers.setSubmitting(false);
      },
      () => {
        formikHelpers.setSubmitting(false);
      },
    );
  };

  // Prepare the create approved item mutation
  const [createApprovedItem] = useCreateApprovedCorpusItemMutation();

  // Prepare the upload approved item image mutation
  const [uploadApprovedItemImage] = useUploadApprovedCorpusItemImageMutation();

  // The toast notification hook
  const { showNotification } = useNotifications();

  // state variable to store s3 image url when user uploads a new image
  const [userUploadedS3ImageUrl, setUserUploadedS3ImageUrl] = useState<
    undefined | string
  >();

  /**
   *
   * This function gets called by the onCuratedItemSave function
   * it creates an approved item from a prospect and marks it as curated
   */
  const createApprovedItemAndMarkAsCurated = async (
    s3ImageUrl: string,
    values: FormikValues,
    formikHelpers: FormikHelpers<any>,
  ): Promise<void> => {
    //build an approved item

    const imageUrl: string = s3ImageUrl;

    const approvedItem = {
      prospectId: currentProspect?.prospectId,
      url: values.url,
      title: values.title,
      excerpt: values.excerpt,
      status: values.curationStatus,
      language: values.language,
      authors: transformAuthors(values.authors),
      publisher: values.publisher,
      datePublished: values.datePublished,
      source: values.source,
      imageUrl,
      topic: values.topic,
      isCollection: values.collection,
      isTimeSensitive: values.timeSensitive,
      isSyndicated: values.syndicated,
      actionScreen: ActionScreen.Prospecting,
    };

    // call the create approved item mutation
    runMutation(
      createApprovedItem,
      { variables: { data: { ...approvedItem } } },
      'Item successfully added to the curated corpus.',
      (approvedItemData: CreateApprovedCorpusItemMutation) => {
        // if we have a prospect id, we need to tell prospect api that this
        // prospect has been curated
        if (currentProspect?.id !== '') {
          // call the mutation to mark prospect as approved
          runMutation(
            updateProspectAsCurated,
            { variables: { id: currentProspect?.id } },
            undefined,
            () => {
              postCreateApprovedItem(
                approvedItemData.createApprovedCorpusItem,
                true,
              );

              formikHelpers.setSubmitting(false);
            },
            () => {
              formikHelpers.setSubmitting(false);
            },
          );
        } else {
          // if we don't have a prospect id, this was a manually added prospect,
          // and we don't need to call prospect api at all
          postCreateApprovedItem(
            approvedItemData.createApprovedCorpusItem,
            false,
          );

          formikHelpers.setSubmitting(false);
        }
      },
    );
  };

  /**
   * common stuff we (may) need to do after creating an approved item
   *
   * @param approvedItem
   * @param isRegularProspect
   * and also
   */
  const postCreateApprovedItem = (
    approvedItem: ApprovedCorpusItem,
    isRegularProspect: boolean,
  ): void => {
    toggleApprovedItemModal();

    if (approvedItem.status === CuratedStatus.Recommendation) {
      setApprovedItem(approvedItem);
      if (isRegularProspect) {
        toggleScheduleModalAndDisableScheduledSurface();
      } else {
        toggleScheduleModalAndEnableScheduledSurface();
      }
    }

    if (isRegularProspect) {
      // Remove the newly curated item from the list of prospects displayed
      // on the page.
      setProspects(
        prospects.filter((prospect) => prospect.id !== currentProspect?.id!),
      );
    }
  };

  /**
   *
   * This function gets called when the user saves(approves) a prospect
   */
  const onCuratedItemSave = async (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>,
  ) => {
    try {
      // set s3ImageUrl variable to the user uploaded s3 image url
      let s3ImageUrl = userUploadedS3ImageUrl;

      // if user uploaded s3 url does not exist
      // download the image from the publisher and upload it to s3
      if (!s3ImageUrl) {
        s3ImageUrl = await downloadAndUploadApprovedItemImageToS3(
          values.imageUrl,
          uploadApprovedItemImage,
        );
      }

      // create an approved item and mark the prospect as curated
      await createApprovedItemAndMarkAsCurated(
        s3ImageUrl,
        values,
        formikHelpers,
      );

      // reset the userUploadedS3ImageUrl state variable so that the
      // manually uploaded image from a previous prospect does not persist
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
    formikHelpers: FormikHelpers<any>,
  ): void => {
    // DE items migrated from the old system don't have a topic. This check forces to add a topic before scheduling
    if (!approvedItem?.topic) {
      showNotification('Cannot schedule item without topic', 'error');
      return;
    }

    // Set out all the variables we need to pass to the mutation
    const variables = {
      approvedItemExternalId: approvedItem?.externalId,
      scheduledSurfaceGuid: values.scheduledSurfaceGuid,
      scheduledDate: values.scheduledDate.toISODate(),
      source: ActivitySource.Manual,
      // Refrain from sending empty strings (form defaults) to the mutation
      // if no data has been supplied for these fields: for example, when they're
      // not needed for the Pocket Hits surface or any other surface where
      // these fields are not shown.
      reason:
        values.manualScheduleReason == '' ? null : values.manualScheduleReason,
      reasonComment: values.reasonComment == '' ? null : values.reasonComment,
      actionScreen: ActionScreen.Prospecting,
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

        // In case this prospect already existed in the corpus database i.e. it has an approvedItem on it,
        // mark it as curated at this point
        // A manually added item/currentProspect won't have an approvedItem on it so this check is never hit
        if (currentProspect?.approvedCorpusItem) {
          runMutation(updateProspectAsCurated, {
            variables: { id: currentProspect?.id },
          });
        }

        // Remove the previously curated item from the list of prospects displayed
        // on the page.
        setProspects(
          prospects.filter((prospect) => prospect.id !== currentProspect?.id!),
        );

        // Hide the Schedule Item Form modal
        toggleScheduleModal();

        // Refresh the sidebar data if it is showing the date this new prospect
        // has just been scheduled for
        if (
          sidebarDate &&
          sidebarDate.toFormat('yyyy-MM-dd') ===
            values.scheduledDate.toFormat('yyyy-MM-dd')
        ) {
          setRefreshSidebarData(true);
        }
      },
      () => {
        // Hide the loading indicator
        formikHelpers.setSubmitting(false);
      },
    );
  };

  /**
   * Gets called after a successful/failed dismissProspect mutation call and shows success or error toast.
   * On success, updates the state by removing the dismissed prospect.
   * @param prospectId
   * @param errorMessage
   * @returns void
   */
  const onRemoveProspect = (
    prospectId: string,
    errorMessage?: string,
  ): void => {
    if (errorMessage) {
      showNotification(errorMessage, 'error');
      return;
    }

    // if request is successful, update the list of prospects currently rendered by removing the dismissed prospect
    setProspects(prospects.filter((prospect) => prospect.id !== prospectId));
    showNotification('Prospect dismissed', 'success');
  };

  // state variable to toggle on or off the empty state component
  // if the callGetProspects query returns no data and no errors, this will be set to true
  const [showEmptyState, setShowEmptyState] = useState<boolean>(false);

  const toggleScheduleModalAndDisableScheduledSurface = () => {
    setDisableScheduledSurface(true), toggleScheduleModal();
  };

  const toggleScheduleModalAndEnableScheduledSurface = () => {
    setDisableScheduledSurface(false), toggleScheduleModal();
  };

  // Filter prospects by Publisher (frontend only)
  // This switch has a negative name ("exclude..." because that's the default,
  // and most useful to curators, option
  const [excludePublisherSwitch, setExcludePublisherSwitch] = useState(true);

  // Toggle the exclude/include switch - passed on to the ProspectFilters component
  const toggleExcludePublisherSwitch = () => {
    setExcludePublisherSwitch((prev) => !prev);
  };
  // The value of the publisher filter (min two characters), e.g. "cnbc". Case-insensitive.
  const [filterByPublisher, setFilterByPublisher] = useState('');

  // Sorts by descending published date
  const [sortByPublishedDate, setSortByPublishedDate] = useState(false);

  // Sorts by descending time to read
  const [sortByTimeToRead, setSortByTimeToRead] = useState(false);

  const handleSortByPublishedDate = (prospectList: Prospect[]) => {
    const sortedProspects = [...(prospectList || [])].sort((a, b) => {
      return (
        new Date(b.item?.datePublished ?? distantPast).getTime() -
        new Date(a.item?.datePublished ?? distantPast).getTime()
      );
    });
    setProspects(sortedProspects);
  };

  const onSortByPublishedDate = () => {
    // from not sorted to sorted
    if (!sortByPublishedDate) {
      // if sortByTimeToRead is set, toggle it off
      sortByTimeToRead && setSortByTimeToRead(false);

      handleSortByPublishedDate(prospects);
      setSortByPublishedDate((prev) => !prev);
      return;
    }

    const mappedProspectIds = prospects.map((p) => p.id);
    setProspects(
      unsortedProspects.filter((up: { id: string }) =>
        mappedProspectIds.includes(up.id),
      ),
    );
    setSortByPublishedDate((prev) => !prev);
  };

  const handleSortByTimeToRead = (unsortedProspects: Prospect[]): void => {
    // if toggled on, toggle off and reset to unsorted prospects
    if (sortByTimeToRead) {
      setSortByTimeToRead(false);
      setProspects(unsortedProspects);

      return;
    }

    // if sortByPublishedDate is set, toggle it off before sorting by time to read below
    sortByPublishedDate && setSortByPublishedDate(false);

    // create a copy of the unsorted prospects
    // we don't want to mutate the original unsorted prospect array
    const prospectsToSort = [...unsortedProspects];

    // apply sort by time to read
    setSortByTimeToRead(true);
    setProspects(
      prospectsToSort.sort((a, b) => {
        return (b.item?.timeToRead ?? 0) - (a.item?.timeToRead ?? 0);
      }),
    );
  };

  return (
    <>
      {currentProspect && (
        <>
          <RejectItemModal
            prospect={currentProspect}
            isOpen={rejectModalOpen}
            onSave={onRejectSave}
            toggleModal={toggleRejectModal}
          />

          <ApprovedItemModal
            approvedItem={transformProspectToApprovedItem(
              currentProspect,
              isRecommendation,
              isManualSubmission,
            )}
            heading={isRecommendation ? 'Recommend' : 'Add to Corpus'}
            isOpen={approvedItemModalOpen}
            onSave={onCuratedItemSave}
            toggleModal={toggleApprovedItemModal}
            onImageSave={setUserUploadedS3ImageUrl}
            isRecommendation={isRecommendation}
          />
        </>
      )}
      <RefreshProspectsModal
        isOpen={refreshProspectsModalOpen}
        onConfirm={() => {
          refetch && refetch(filterProspectsBy);
          toggleRefreshProspectsModal();
        }}
        toggleModal={toggleRefreshProspectsModal}
      />
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
      {approvedItem && (
        <ScheduleItemModal
          approvedItem={approvedItem}
          headingCopy="Schedule this item"
          isOpen={scheduleModalOpen}
          scheduledSurfaceGuid={currentScheduledSurfaceGuid}
          disableScheduledSurface={disableScheduledSurface}
          showManualScheduleReasons={
            /* Only ask for manual schedule reasons if the curator is working on the US New Tab or German New Tab
             * and if it's not a syndicated item */
            (currentScheduledSurfaceGuid === 'NEW_TAB_EN_US' ||
              (currentScheduledSurfaceGuid === 'NEW_TAB_DE_DE' &&
                !approvedItem.prospectId)) &&
            !approvedItem.isSyndicated
          }
          expandSummary={
            /* Expand the Topic & Publisher Summary for syndicated articles */
            approvedItem.isSyndicated
          }
          onSave={onScheduleSave}
          toggleModal={toggleScheduleModalAndDisableScheduledSurface}
        />
      )}

      {approvedItem && (
        <DuplicateProspectModal
          approvedItem={approvedItem}
          isOpen={duplicateProspectModalOpen}
          toggleModal={toggleDuplicateProspectModal}
        />
      )}

      <h1>Prospecting</h1>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={8}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              {!scheduledSurfaceData && (
                <HandleApiResponse
                  loading={scheduledSurfaceLoading}
                  error={scheduledSurfaceError}
                />
              )}
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
                  sx={{ color: curationPalette.pocketBlack }}
                  onClick={() => {
                    // toggle the add prospect modal
                    toggleAddProspectModal();
                  }}
                >
                  <AddIcon fontSize="large" />
                </Button>
                <Button
                  sx={{ color: curationPalette.pocketBlack }}
                  onClick={() => {
                    // If all the prospects have been processed already,
                    // there is no need for a confirmation dialogue here,
                    // let's just fetch a new batch of prospects.
                    prospects && prospects.length > 0
                      ? toggleRefreshProspectsModal()
                      : refetch && refetch(filterProspectsBy);
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
            <Grid item xs={12}>
              <ProspectFilters
                prospects={getFilteredProspects(
                  prospects,
                  filterByPublisher,
                  excludePublisherSwitch,
                )}
                setProspectMetadataFilters={setProspectMetadataFilters}
                filterByPublisher={filterByPublisher}
                setFilterByPublisher={setFilterByPublisher}
                onChange={toggleExcludePublisherSwitch}
                excludePublisherSwitch={excludePublisherSwitch}
                onSortByPublishedDate={onSortByPublishedDate}
                sortByPublishedDate={sortByPublishedDate}
                sortByTimeToRead={sortByTimeToRead}
                handleSortByTimeToRead={() =>
                  handleSortByTimeToRead(unsortedProspects)
                }
              />
            </Grid>
          </Grid>

          {!prospects && <HandleApiResponse loading={loading} error={error} />}
          {showEmptyState && <EmptyState />}
          {prospects &&
            getFilteredProspects(
              prospects,
              filterByPublisher,
              excludePublisherSwitch,
            ).map((prospect: Prospect) => {
              // There are some cases when topic on prospect is not set directly
              // but set on the approvedCorpusItem. Set prospect.topic if this is the case
              // to filter easier
              if (
                !prospect.topic &&
                prospect.approvedCorpusItem &&
                getDisplayTopic(prospect.approvedCorpusItem.topic)
              ) {
                prospect.topic = prospect.approvedCorpusItem.topic;
              }
              if (
                prospectMetadataFilters.topics === 'All' ||
                prospectMetadataFilters.topics ===
                  getDisplayTopic(prospect.topic) ||
                (prospect.approvedCorpusItem &&
                  prospectMetadataFilters.topics ===
                    getDisplayTopic(prospect.approvedCorpusItem!.topic))
              ) {
                if (prospect.approvedCorpusItem) {
                  return (
                    <>
                      <ExistingProspectCard
                        key={prospect.id}
                        item={prospect.approvedCorpusItem}
                        parserItem={prospect.item!}
                        prospectId={prospect.id}
                        prospectType={prospect.prospectType}
                        prospectTitle={prospect.title as string}
                        onSchedule={() => {
                          setCurrentProspect(prospect);
                          setApprovedItem(prospect.approvedCorpusItem!);
                          toggleScheduleModalAndDisableScheduledSurface();
                        }}
                        onRemoveProspect={onRemoveProspect}
                      />
                    </>
                  );
                }
                return (
                  <>
                    <ProspectListCard
                      key={prospect.id}
                      parserItem={prospect.item!}
                      prospect={prospect}
                      onAddToCorpus={() => {
                        setCurrentProspect(prospect);
                        setIsManualSubmission(false);
                        setIsRecommendation(false);
                        toggleApprovedItemModal();
                      }}
                      onRemoveProspect={onRemoveProspect}
                      onRecommend={() => {
                        setCurrentProspect(prospect);
                        setIsManualSubmission(false);
                        setIsRecommendation(true);
                        toggleApprovedItemModal();
                      }}
                      onReject={() => {
                        setCurrentProspect(prospect);
                        toggleRejectModal();
                      }}
                    />
                  </>
                );
              }
            })}
        </Grid>
        <Hidden xsDown>
          <Grid item sm={4}>
            {currentScheduledSurfaceGuid.length > 0 && (
              <SidebarWrapper
                date={sidebarDate!}
                setSidebarDate={setSidebarDate}
                scheduledSurfaceGuid={currentScheduledSurfaceGuid}
                refreshData={refreshSidebarData}
                setRefreshData={setRefreshSidebarData}
              />
            )}
          </Grid>
        </Hidden>
      </Grid>
    </>
  );
};
