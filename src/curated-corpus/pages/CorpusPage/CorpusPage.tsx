import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { FormikHelpers, FormikValues } from 'formik';
import { config } from '../../../config';
import {
  ApprovedCorpusItem,
  ApprovedCorpusItemEdge,
  ApprovedCorpusItemFilter,
  useGetApprovedItemsLazyQuery,
  useUpdateApprovedCorpusItemMutation,
} from '../../../api/generatedTypes';
import { HandleApiResponse } from '../../../_shared/components';
import {
  ApprovedItemCardWrapper,
  ApprovedItemModal,
  ApprovedItemSearchForm,
  NextPrevPagination,
  RejectCorpusItemAction,
  ScheduleCorpusItemAction,
} from '../../components';
import { useRunMutation, useToggle } from '../../../_shared/hooks';
import { transformAuthors } from '../../../_shared/utils/transformAuthors';

export const CorpusPage: React.FC = (): JSX.Element => {
  // Get the usual API response vars and a helper method to retrieve data
  // that can be used inside hooks.
  const [getApprovedCorpusItems, { loading, error, data, refetch }] =
    useGetApprovedItemsLazyQuery(
      // We need to make sure search results are never served from the cache.
      { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
    );

  // Get a helper function that will execute each mutation, show standard notifications
  // and execute any additional actions in a callback
  const { runMutation } = useRunMutation();

  // Save the filters in a state variable to be able to use them when paginating
  // through results.
  const [filters, setFilters] = useState<ApprovedCorpusItemFilter>({});

  // Save the cursors returned with every request to be able to use them when
  // paginating through results.
  const [before, setBefore] = useState<string | null | undefined>(undefined);
  const [after, setAfter] = useState<string | null | undefined>(undefined);

  // On the initial page load, load most recently added Curated Items -
  // the first page of results, no filters applied.
  useEffect(() => {
    getApprovedCorpusItems({
      variables: {
        pagination: { first: config.pagination.curatedItemsPerPage },
      },
    });
  }, []);

  // Set the cursors once data is returned by the API.
  useEffect(() => {
    if (data) {
      setAfter(data.getApprovedCorpusItems.pageInfo.endCursor);
      setBefore(data.getApprovedCorpusItems.pageInfo.startCursor);
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
    getApprovedCorpusItems({
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
    getApprovedCorpusItems({
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
    getApprovedCorpusItems({
      variables: {
        pagination: { last: config.pagination.curatedItemsPerPage, before },
        filters,
      },
    });
  };

  /**
   * Keep track of whether the "Schedule this item" modal is open or not.
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
   * Set the current Approved Item to be worked on (e.g., edited or scheduled).
   */
  const [currentItem, setCurrentItem] = useState<
    Omit<ApprovedCorpusItem, '__typename'> | undefined
  >(undefined);

  // Mutation for updating an approved item
  const [updateApprovedItem] = useUpdateApprovedCorpusItemMutation();

  /**
   * Executed on form submission
   */
  const onEditItemSave = (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ): void => {
    const variables = {
      data: {
        externalId: currentItem?.externalId,
        title: values.title,
        excerpt: values.excerpt,
        status: values.curationStatus,
        language: values.language,
        authors: transformAuthors(values.authors),
        publisher: values.publisher,
        imageUrl: values.imageUrl,
        topic: values.topic,
        isTimeSensitive: values.timeSensitive,
      },
    };

    // Executed the mutation to update the approved item
    runMutation(
      updateApprovedItem,
      { variables },
      `Curated item "${currentItem?.title.substring(
        0,
        40
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

  return (
    <>
      <h1>Corpus</h1>
      <ApprovedItemSearchForm onSubmit={handleSubmit} />

      {!data && <HandleApiResponse loading={loading} error={error} />}

      {currentItem && (
        <>
          <ScheduleCorpusItemAction
            item={currentItem}
            modalOpen={scheduleModalOpen}
            toggleModal={toggleScheduleModal}
            refetch={refetch}
          />
          <ApprovedItemModal
            approvedItem={currentItem}
            heading="Edit Item"
            showItemTitle={true}
            isOpen={editModalOpen}
            onSave={onEditItemSave}
            toggleModal={toggleEditModal}
          />
          <RejectCorpusItemAction
            item={currentItem}
            modalOpen={rejectModalOpen}
            toggleModal={toggleRejectModal}
            refetch={refetch}
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
              Found {data.getApprovedCorpusItems.totalCount} result(s).
            </Typography>
          </Grid>
        )}
        {data &&
          data.getApprovedCorpusItems.edges.map(
            (edge: ApprovedCorpusItemEdge) => {
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
          hasNextPage={data.getApprovedCorpusItems.pageInfo.hasNextPage}
          loadNext={loadNext}
          hasPreviousPage={data.getApprovedCorpusItems.pageInfo.hasPreviousPage}
          loadPrevious={loadPrevious}
        />
      )}
    </>
  );
};
