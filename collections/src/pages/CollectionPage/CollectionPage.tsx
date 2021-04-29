import React from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { Box } from '@material-ui/core';

import {
  CollectionInfo,
  HandleApiResponse,
  ScrollToTop,
} from '../../components';

import { CollectionModel, useGetCollectionByIdQuery } from '../../api';

interface CollectionPageProps {
  collection?: CollectionModel;
}

export const CollectionPage = (): JSX.Element => {
  /**
   * If a Collection object was passed to the page from one of the other app pages,
   * let's extract it from the routing.
   */
  const location = useLocation<CollectionPageProps>();
  let collection: CollectionModel | undefined = location.state?.collection
    ? // Deep clone a read-only object that comes from the routing
      JSON.parse(JSON.stringify(location.state?.collection))
    : undefined;

  /**
   * If the user came directly to this page (i.e., via a bookmarked page),
   * fetch the Collection info from the the API.
   */
  const params = useParams<{ id: string }>();
  const { loading, error, data } = useGetCollectionByIdQuery({
    variables: {
      id: params.id,
    },
    // Skip query if author object was delivered via the routing
    // This is needed because hooks can only be called at the top level
    // of the component.
    skip: typeof collection === 'object',
  });

  return (
    <>
      <ScrollToTop />
      {!data && <HandleApiResponse loading={loading} error={error} />}
      {collection && (
        <>
          <Box display="flex">
            <Box flexGrow={1} alignSelf="center" textOverflow="ellipsis">
              <h1>{collection.title}</h1>
            </Box>
          </Box>
          <CollectionInfo collection={collection} />
        </>
      )}
    </>
  );
};
