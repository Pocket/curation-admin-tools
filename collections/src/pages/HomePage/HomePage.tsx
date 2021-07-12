import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button } from '@material-ui/core';
import {
  Collection,
  useGetDraftCollectionsQuery,
  useGetPublishedCollectionsQuery,
} from '../../api/collection-api/generatedTypes';
import { CollectionListCard, HandleApiResponse } from '../../components';

/**
 * Home Page
 */
export const HomePage = (): JSX.Element => {
  // Load a few of the most recent draft collections
  const { loading, error, data } = useGetDraftCollectionsQuery({
    variables: { page: 1, perPage: 3 },
  });

  // Load a few of the most recent published collections
  const {
    loading: loadingPublished,
    error: errorPublished,
    data: dataPublished,
  } = useGetPublishedCollectionsQuery({
    variables: { page: 1, perPage: 3 },
  });

  return (
    <>
      <h2>
        Latest Draft Collections{' '}
        <Box display="inline">
          <Button
            component={Link}
            size="large"
            color="primary"
            to="/collections/drafts/"
          >
            See all
          </Button>
        </Box>
      </h2>
      {!data && <HandleApiResponse loading={loading} error={error} />}
      {data &&
        data.searchCollections.collections.map(
          (collection: Omit<Collection, 'stories'>) => {
            return (
              <CollectionListCard
                key={collection.externalId}
                collection={collection}
              />
            );
          }
        )}
      <h2>
        Latest Published Collections{' '}
        <Box display="inline">
          <Button
            component={Link}
            size="large"
            color="primary"
            to="/collections/published/"
          >
            See all
          </Button>
        </Box>
      </h2>
      {!dataPublished && (
        <HandleApiResponse loading={loadingPublished} error={errorPublished} />
      )}
      {dataPublished &&
        dataPublished.searchCollections.collections.map(
          (collection: Omit<Collection, 'stories'>) => {
            return (
              <CollectionListCard
                key={collection.externalId}
                collection={collection}
              />
            );
          }
        )}
    </>
  );
};
