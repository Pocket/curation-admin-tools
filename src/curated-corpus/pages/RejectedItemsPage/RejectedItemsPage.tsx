import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@material-ui/core';
import { FormikValues } from 'formik';
import { config } from '../../../config';
import {
  RejectedCuratedCorpusItemEdge,
  RejectedCuratedCorpusItemFilter,
  useGetRejectedItemsLazyQuery,
} from '../../../api/generatedTypes';

import { HandleApiResponse } from '../../../_shared/components';
import {
  NextPrevPagination,
  RejectedItemListCard,
  RejectedItemSearchForm,
} from '../../components';

//This page is to display all the Rejected Curated Corpus Items
export const RejectedItemsPage: React.FC = (): JSX.Element => {
  // Get the usual API response vars and a helper method to retrieve data
  // that can be used inside hooks.
  const [getRejectedCuratedCorpusItems, { loading, error, data }] =
    useGetRejectedItemsLazyQuery(
      // We need to make sure search results are never served from the cache.
      { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
    );

  // Save the filters in a state variable to be able to use them when paginating
  // through results.
  const [filters, setFilters] = useState<RejectedCuratedCorpusItemFilter>({});

  // Save the cursors returned with every request to be able to use them when
  // paginating through results.
  const [before, setBefore] = useState<string | null | undefined>(undefined);
  const [after, setAfter] = useState<string | null | undefined>(undefined);

  // On the initial page load, load most recently added Rejected Items -
  // the first page of results, no filters applied.
  useEffect(() => {
    getRejectedCuratedCorpusItems({
      variables: {
        pagination: { first: config.pagination.rejectedItemsPerPage },
      },
    });
  }, []);

  // Set the cursors once data is returned by the API.
  useEffect(() => {
    if (data) {
      setAfter(data.getRejectedCuratedCorpusItems.pageInfo.endCursor);
      setBefore(data.getRejectedCuratedCorpusItems.pageInfo.startCursor);
    }
  }, [data]);

  /**
   * Process search form values and convert them into a RejectedCuratedCorpusItemFilter
   * object that will be accepted as a variable by the getRejectedCuratedCorpusItems query.
   * @param values
   */
  const handleSubmit = (values: FormikValues): void => {
    // Using `any` here as TS is rather unhappy at the below for() loop
    // if filters are correctly typed as RejectedCuratedCorpusItemFilter.
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
    getRejectedCuratedCorpusItems({
      variables: {
        pagination: { first: config.pagination.rejectedItemsPerPage },
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
    getRejectedCuratedCorpusItems({
      variables: {
        pagination: { first: config.pagination.rejectedItemsPerPage, after },
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
    getRejectedCuratedCorpusItems({
      variables: {
        pagination: { last: config.pagination.rejectedItemsPerPage, before },
        filters,
      },
    });
  };

  return (
    <>
      <h1>
        Rejected{' '}
        <Typography variant="caption" title="© 2021 Alex D">
          🦨 Ew Tab
        </Typography>
      </h1>
      <RejectedItemSearchForm onSubmit={handleSubmit} />

      {!data && <HandleApiResponse loading={loading} error={error} />}

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
              Found {data.getRejectedCuratedCorpusItems.totalCount} results.
            </Typography>
          </Grid>
        )}
        {data &&
          data.getRejectedCuratedCorpusItems.edges.map(
            (edge: RejectedCuratedCorpusItemEdge) => {
              return (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  key={`grid-${edge.node.externalId}`}
                >
                  <RejectedItemListCard
                    key={edge.node.externalId}
                    item={edge.node}
                  />
                </Grid>
              );
            }
          )}
      </Grid>

      {data && (
        <NextPrevPagination
          hasNextPage={data.getRejectedCuratedCorpusItems.pageInfo.hasNextPage}
          loadNext={loadNext}
          hasPreviousPage={
            data.getRejectedCuratedCorpusItems.pageInfo.hasPreviousPage
          }
          loadPrevious={loadPrevious}
        />
      )}
    </>
  );
};
