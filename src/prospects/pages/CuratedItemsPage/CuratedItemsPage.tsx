import React from 'react';
import { useFetchMoreResults } from '../../../_shared/hooks';
import {
  CuratedItemEdge,
  useGetCuratedItemsQuery,
} from '../../api/curated-corpus-api/generatedTypes';
import { HandleApiResponse, LoadMore } from '../../../_shared/components';
import { CuratedItemListCard, CuratedItemSearchForm } from '../../components';
import { config } from '../../../config';
import { Grid } from '@material-ui/core';

export const CuratedItemsPage: React.FC = (): JSX.Element => {
  const [loading, reloading, error, data, updateData] = useFetchMoreResults(
    useGetCuratedItemsQuery,
    {
      variables: {
        pagination: { first: config.pagination.curatedItemsPerPage },
      },
    }
  );

  return (
    <>
      <h1>Live Corpus</h1>

      <CuratedItemSearchForm
        onSubmit={() => {
          // This arrow function is not empty.
          // Take that, ESLint!
        }}
      />
      {!data && <HandleApiResponse loading={loading} error={error} />}

      <Grid
        container
        direction="row"
        alignItems="stretch"
        justifyContent="flex-start"
        spacing={3}
      >
        {data &&
          data.getCuratedItems.edges.map((edge: CuratedItemEdge) => {
            if (edge.node) {
              return (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={3}
                  key={`grid-${edge.node?.externalId}`}
                >
                  <CuratedItemListCard
                    key={edge.node?.externalId}
                    item={edge.node}
                  />
                </Grid>
              );
            }
          })}
      </Grid>

      {data && (
        <LoadMore
          buttonDisabled={
            data.getCuratedItems.edges.length ===
            data.getCuratedItems.totalCount
          }
          loadMore={updateData}
          showSpinner={reloading}
        />
      )}
    </>
  );
};
