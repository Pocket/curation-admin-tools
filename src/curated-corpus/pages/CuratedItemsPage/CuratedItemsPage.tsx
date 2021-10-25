import React from 'react';
import { useGetCuratedItemsLazyQuery } from '../../api/curated-corpus-api/generatedTypes';
import { HandleApiResponse } from '../../../_shared/components';
import { CuratedItemListCard, CuratedItemSearchForm } from '../../components';
import { Grid } from '@material-ui/core';
import { FormikValues } from 'formik';

export const CuratedItemsPage: React.FC = (): JSX.Element => {
  // const [loading, reloading, error, data, updateData] = useFetchMoreWithRelay(
  //   useGetCuratedItemsQuery,
  //   {
  //     variables: {
  //       // pagination: { first: config.pagination.curatedItemsPerPage },
  //       pagination: { first: 2 },
  //     },
  //   }
  // );

  const [getCuratedItems, { loading, error, data }] =
    useGetCuratedItemsLazyQuery(
      // We need to make sure search results are never served from the cache.
      { fetchPolicy: 'no-cache' }
    );

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
        // pagination: { first: config.pagination.curatedItemsPerPage },
        pagination: { first: 2 },
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
        {data &&
          data.getCuratedItems?.edges &&
          data.getCuratedItems.edges.map((edge: any) => {
            if (edge && edge.node) {
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

      {/*{data && (*/}
      {/*  <LoadMore*/}
      {/*    buttonDisabled={data.getCuratedItems.pageInfo.hasNextPage}*/}
      {/*    loadMore={updateData}*/}
      {/*    showSpinner={reloading}*/}
      {/*  />*/}
      {/*)}*/}
    </>
  );
};
