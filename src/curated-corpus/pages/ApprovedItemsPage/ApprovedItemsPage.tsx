import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { FormikHelpers, FormikValues } from 'formik';
import { config } from '../../../config';
import {
  ApprovedCuratedCorpusItem,
  ApprovedCuratedCorpusItemEdge,
  ApprovedCuratedCorpusItemFilter,
  useCreateNewTabFeedScheduledItemMutation,
  useGetApprovedItemsLazyQuery,
  useRejectApprovedItemMutation,
  useUpdateApprovedCuratedCorpusItemMutation,
} from '../../api/curated-corpus-api/generatedTypes';
import { HandleApiResponse } from '../../../_shared/components';
import {
  ApprovedItemCardWrapper,
  ApprovedItemSearchForm,
  NextPrevPagination,
  RejectItemModal,
  ScheduleItemModal,
} from '../../components';
import { useRunMutation, useToggle } from '../../../_shared/hooks';
import { DateTime } from 'luxon';
import { ApprovedItemModal } from '../../components/ApprovedItemModal/ApprovedItemModal';

export const ApprovedItemsPage: React.FC = (): JSX.Element => {
  // Get the usual API response vars and a helper method to retrieve data
  // that can be used inside hooks.
  const [getApprovedCuratedCorpusItems, { loading, error, data, refetch }] =
    useGetApprovedItemsLazyQuery(
      // We need to make sure search results are never served from the cache.
      { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
    );

  // Get a helper function that will execute each mutation, show standard notifications
  // and execute any additional actions in a callback
  const { runMutation } = useRunMutation();

  // Save the filters in a state variable to be able to use them when paginating
  // through results.
  const [filters, setFilters] = useState<ApprovedCuratedCorpusItemFilter>({});

  // Save the cursors returned with every request to be able to use them when
  // paginating through results.
  const [before, setBefore] = useState<string | null | undefined>(undefined);
  const [after, setAfter] = useState<string | null | undefined>(undefined);

  // On the initial page load, load most recently added Curated Items -
  // the first page of results, no filters applied.
  useEffect(() => {
    getApprovedCuratedCorpusItems({
      variables: {
        pagination: { first: config.pagination.curatedItemsPerPage },
      },
    });
  }, []);

  // Set the cursors once data is returned by the API.
  useEffect(() => {
    if (data) {
      setAfter(data.getApprovedCuratedCorpusItems.pageInfo.endCursor);
      setBefore(data.getApprovedCuratedCorpusItems.pageInfo.startCursor);
    }
  }, [data]);

  /**
   * Process search form values and convert them into a CuratedItemFilter
   * object that will be accepted as a variable by the getCuratedItems query.
   * @param values
   */
  const handleSubmit = (values: FormikValues): void => {
    // Using `any` here as TS is rather unhappy at the below for() loop
    // if filters are correctly typed as CuratedItemFilter.
    // The alternative appears to be setting the type correctly and then
    // manually checking each possible filter form value and setting it
    // in the filter input if it contains something.
    const filters: any = {};

    for (const key in values) {
      if (values[key].length > 0) {
        filters[key] = values[key];
      }
    }

    // Execute the search.
    getApprovedCuratedCorpusItems({
      variables: {
        pagination: { first: config.pagination.curatedItemsPerPage },
        filters,
      },
    });

    setFilters(filters);
  };

  /**
   * Fetch the next page's worth of search results.
   *
   * Note: no caching policies have been implemented yet.
   * Results are always retrieved from the API.
   */
  const loadNext = () => {
    getApprovedCuratedCorpusItems({
      variables: {
        pagination: { first: config.pagination.curatedItemsPerPage, after },
        filters,
      },
    });
  };

  /**
   * Fetch the previous page's worth of search results.
   *
   * Note: no caching policies have been implemented yet.
   * Results are always retrieved from the API.
   */
  const loadPrevious = () => {
    getApprovedCuratedCorpusItems({
      variables: {
        pagination: { last: config.pagination.curatedItemsPerPage, before },
        filters,
      },
    });
  };

  /**
   * Keep track of whether the "Schedule this item for New Tab" modal is open or not.
   */
  const [scheduleModalOpen, toggleScheduleModal] = useToggle(false);
  /**
   * Keep track of whether the "Reject this item" modal is open or not.
   */
  const [rejectModalOpen, toggleRejectModal] = useToggle(false);

  /**
   * Keep track of whether the "Edit this item" modal is open or not.
   */
  const [editModalOpen, toggleEditModal] = useToggle(false);

  /**
   * Set the current Approved Item to be worked on (e.g., scheduled for New Tab).
   */
  const [currentItem, setCurrentItem] = useState<
    Omit<ApprovedCuratedCorpusItem, '__typename'> | undefined
  >(undefined);

  // 1. Prepare the "reject curated item" mutation
  const [rejectCuratedItem] = useRejectApprovedItemMutation();
  // 2. Remove the curated item from the recommendation corpus and place it
  // into the rejected item list.
  const onRejectSave = (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ): void => {
    // Set out all the variables we need to pass to the mutation
    const variables = {
      data: {
        externalId: currentItem?.externalId,
        reason: values.reason,
      },
    };

    // Run the mutation
    runMutation(
      rejectCuratedItem,
      { variables },
      `Item successfully moved to the rejected corpus.`,
      () => {
        toggleRejectModal();
        formikHelpers.setSubmitting(false);
      },
      () => {
        formikHelpers.setSubmitting(false);
      },
      refetch
    );
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
      approvedItemExternalId: currentItem?.externalId,
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

  // Mutation for updating an approved item
  const [updateApprovedItem] = useUpdateApprovedCuratedCorpusItemMutation();

  /**
   * Executed on form submission
   */
  const onEditItemSave = (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ): void => {
    // Mapping these values to match the format that mutation/DB accepts
    const languageCode: string = values.language === 'English' ? 'en' : 'de';
    const curationStatus: string = values.curationStatus.toUpperCase();
    const topic: string = values.topic.toUpperCase();

    const variables = {
      data: {
        externalId: currentItem?.externalId,
        prospectId: currentItem?.prospectId,
        url: values.url,
        title: values.title,
        excerpt: values.excerpt,
        status: curationStatus,
        language: languageCode,
        publisher: values.publisher,
        imageUrl: currentItem?.imageUrl,
        topic: topic,
        isCollection: values.collection,
        isShortLived: values.shortLived,
        isSyndicated: values.syndicated,
      },
    };

    // Executed the mutation to update the approved item
    runMutation(
      updateApprovedItem,
      { variables },
      `Curated item "${currentItem?.title.substring(
        0,
        50
      )}..." successfully updated`,
      () => {
        toggleEditModal();
        formikHelpers.setSubmitting(false);
      },
      () => {
        formikHelpers.setSubmitting(false);
      },
      refetch
    );
  };

  /**
   * This function is executed by the ImageUpload component after it uploads an image to S3,
   * it runs the mutation to update the current item's ImageUrl
   */
  const onApprovedItemImageSave = (url: string): void => {
    // update the approved item with new image url

    const variables = {
      data: {
        externalId: currentItem?.externalId,
        prospectId: currentItem?.prospectId,
        url: currentItem?.url,
        title: currentItem?.title,
        excerpt: currentItem?.excerpt,
        status: currentItem?.status,
        language: currentItem?.language,
        publisher: currentItem?.publisher,
        imageUrl: url,
        topic: currentItem?.topic,
        isCollection: currentItem?.isCollection,
        isShortLived: currentItem?.isShortLived,
        isSyndicated: currentItem?.isSyndicated,
      },
    };

    // Run the mutation to update item with new image url
    runMutation(updateApprovedItem, { variables });

    if (currentItem) {
      setCurrentItem({ ...currentItem, imageUrl: url });
    }
  };

  return (
    <>
      <h1>Live Corpus</h1>
      <ApprovedItemSearchForm onSubmit={handleSubmit} />

      {!data && <HandleApiResponse loading={loading} error={error} />}

      {currentItem && (
        <>
          <ScheduleItemModal
            approvedItem={currentItem}
            isOpen={scheduleModalOpen}
            onSave={onScheduleSave}
            toggleModal={toggleScheduleModal}
          />
          <ApprovedItemModal
            approvedItem={currentItem}
            isOpen={editModalOpen}
            onSave={onEditItemSave}
            toggleModal={toggleEditModal}
            onImageSave={onApprovedItemImageSave}
          />
          <RejectItemModal
            prospect={currentItem}
            isOpen={rejectModalOpen}
            onSave={onRejectSave}
            toggleModal={toggleRejectModal}
          />
        </>
      )}

      <Grid
        container
        direction="row"
        alignItems="stretch"
        justifyContent="flex-start"
        spacing={3}
      >
        {data && (
          <Grid item xs={12}>
            <Typography>
              Found {data.getApprovedCuratedCorpusItems.totalCount} results.
            </Typography>
          </Grid>
        )}
        {data &&
          data.getApprovedCuratedCorpusItems.edges.map(
            (edge: ApprovedCuratedCorpusItemEdge) => {
              return (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  key={`grid-${edge.node.externalId}`}
                >
                  <ApprovedItemCardWrapper
                    key={edge.node.externalId}
                    item={edge.node}
                    onSchedule={() => {
                      setCurrentItem(edge.node);
                      toggleScheduleModal();
                    }}
                    onEdit={() => {
                      setCurrentItem(edge.node);
                      toggleEditModal();
                    }}
                    onReject={() => {
                      setCurrentItem(edge.node);
                      toggleRejectModal();
                    }}
                  />
                </Grid>
              );
            }
          )}
      </Grid>

      {data && (
        <NextPrevPagination
          hasNextPage={data.getApprovedCuratedCorpusItems.pageInfo.hasNextPage}
          loadNext={loadNext}
          hasPreviousPage={
            data.getApprovedCuratedCorpusItems.pageInfo.hasPreviousPage
          }
          loadPrevious={loadPrevious}
        />
      )}
    </>
  );
};
