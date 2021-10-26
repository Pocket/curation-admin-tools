import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { FormikValues } from 'formik';
import { config } from '../../../config';
import {
  CuratedItemEdge,
  CuratedItemFilter,
  useGetCuratedItemsLazyQuery,
} from '../../api/curated-corpus-api/generatedTypes';
import { Button, HandleApiResponse } from '../../../_shared/components';
import { CuratedItemListCard, CuratedItemSearchForm } from '../../components';

export const CuratedItemsPage: React.FC = (): JSX.Element => {
  const [getCuratedItems, { loading, error, data }] =
    useGetCuratedItemsLazyQuery(
      // We need to make sure search results are never served from the cache.
      { fetchPolicy: 'no-cache', notifyOnNetworkStatusChange: true }
    );

  const [before, setBefore] = useState<string | null | undefined>(undefined);
  const [after, setAfter] = useState<string | null | undefined>(undefined);
  const [filters, setFilters] = useState<CuratedItemFilter>({});

  useEffect(() => {
    // On the initial page load, load most recently added Curated Items -
    // the first page of results, no filters applied.
    getCuratedItems({
      variables: {
        pagination: { first: config.pagination.curatedItemsPerPage },
      },
    });
  }, []);

  useEffect(() => {
    if (data) {
      setAfter(data.getCuratedItems.pageInfo.endCursor);
      setBefore(data.getCuratedItems.pageInfo.startCursor);
    }
  }, [data]);

  const handleSubmit = (values: FormikValues): void => {
    // prepare the search filters
    const filters: any = {};

    for (const key in values) {
      if (values[key].length > 0) {
        filters[key] = values[key];
      }
    }

    // execute the search
    getCuratedItems({
      variables: {
        pagination: { first: config.pagination.curatedItemsPerPage },
        filters,
      },
    });

    setFilters(filters);
  };

  const loadNextPage = () => {
    getCuratedItems({
      variables: {
        pagination: { first: config.pagination.curatedItemsPerPage, after },
        filters,
      },
    });
  };

  const loadPreviousPage = () => {
    getCuratedItems({
      variables: {
        pagination: { last: config.pagination.curatedItemsPerPage, before },
        filters,
      },
    });
  };

  return (
    <>
      <h1>Live Corpus</h1>
      <CuratedItemSearchForm onSubmit={handleSubmit} />

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
              Found {data.getCuratedItems.totalCount} results.
            </Typography>
          </Grid>
        )}
        {data &&
          data.getCuratedItems.edges.map((edge: CuratedItemEdge) => {
            return (
              <Grid
                item
                xs={12}
                sm={6}
                md={3}
                key={`grid-${edge.node.externalId}`}
              >
                <CuratedItemListCard
                  key={edge.node.externalId}
                  item={edge.node}
                />
              </Grid>
            );
          })}
      </Grid>

      {data && (
        <Box display="flex" justifyContent="center" m={2}>
          {data.getCuratedItems.pageInfo.hasPreviousPage && (
            <Button variant="text" onClick={loadPreviousPage}>
              <ArrowBackIcon /> Previous Page
            </Button>
          )}

          {data.getCuratedItems.pageInfo.hasNextPage && (
            <Button variant="text" onClick={loadNextPage}>
              Next Page
              <ArrowForwardIcon />
            </Button>
          )}
        </Box>
      )}
    </>
  );
};
