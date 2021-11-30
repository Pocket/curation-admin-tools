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
} from '../../api/curated-corpus-api/generatedTypes';
import { HandleApiResponse } from '../../../_shared/components';
import {
  ApprovedItemListCard,
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
  const [getApprovedCuratedCorpusItems, { loading, error, data }] =
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
    ApprovedCuratedCorpusItem | undefined
  >(undefined);

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

  const onEditItemSave = (): void => {
    //TODO: @Herraj - Add some mutation logic here. Possibly remove this dependency of drilling down this callback 3 levels deep

    //place holder
    alert('Item Successfully Edited');
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
          />
          <RejectItemModal
            prospect={currentItem}
            isOpen={rejectModalOpen}
            onSave={() => {
              // nothing to see here
            }}
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
                  <ApprovedItemListCard
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
