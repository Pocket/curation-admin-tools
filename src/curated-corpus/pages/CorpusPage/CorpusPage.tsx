import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { FormikValues } from 'formik';
import { config } from '../../../config';
import {
  ApprovedCorpusItem,
  ApprovedCorpusItemEdge,
  ApprovedCorpusItemFilter,
  useGetApprovedItemsLazyQuery,
  useGetScheduledSurfacesForUserQuery,
} from '../../../api/generatedTypes';
import { HandleApiResponse } from '../../../_shared/components';
import {
  ApprovedItemCardWrapper,
  ApprovedItemSearchForm,
  EditCorpusItemAction,
  NextPrevPagination,
  RejectCorpusItemAction,
  ScheduleCorpusItemAction,
  SidebarWrapper,
} from '../../components';
import { useToggle } from '../../../_shared/hooks';
import { DateTime } from 'luxon';

export const CorpusPage: React.FC = (): JSX.Element => {
  // Get the usual API response vars and a helper method to retrieve data
  // that can be used inside hooks.
  const [getApprovedCorpusItems, { loading, error, data, refetch }] =
    useGetApprovedItemsLazyQuery(
      // We need to make sure search results are never served from the cache.
      { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
    );

  // Save the filters in a state variable to be able to use them when paginating
  // through results.
  const [filters, setFilters] = useState<ApprovedCorpusItemFilter>({});

  // Save the cursors returned with every request to be able to use them when
  // paginating through results.
  const [before, setBefore] = useState<string | null | undefined>(undefined);
  const [after, setAfter] = useState<string | null | undefined>(undefined);

  // set up the initial scheduled surface guid value (nothing at this point)
  const [currentScheduledSurfaceGuid, setCurrentScheduledSurfaceGuid] =
    useState('');

  // This is the date used in the sidebar. Defaults to tomorrow
  const [sidebarDate, setSidebarDate] = useState<DateTime | null>(
    DateTime.local().plus({ days: 1 })
  );

  // Whether the data in the sidebar needs to be refreshed.
  // Is needed when the user switches from surface to surface or
  // when they schedule something for the date chosen in the sidebar.
  const [refreshSidebarData, setRefreshSidebarData] = useState(false);

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
        }
      );
      if (options.length > 0) {
        setCurrentScheduledSurfaceGuid(options[0].code);
      }
    },
  });

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

  return (
    <>
      <h1>Corpus</h1>
      <Grid container spacing={2}>
        <Grid item xs={8}>
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
              <EditCorpusItemAction
                item={currentItem}
                modalOpen={editModalOpen}
                toggleModal={toggleEditModal}
                refetch={refetch}
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
                      md={4}
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
        </Grid>
        {!scheduledSurfaceData && (
          <HandleApiResponse
            loading={scheduledSurfaceLoading}
            error={scheduledSurfaceError}
          />
        )}
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
