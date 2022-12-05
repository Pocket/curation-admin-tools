import React from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';
import {
  Button,
  HandleApiResponse,
  LoadMore,
} from '../../../_shared/components';
import { AuthorListCard } from '../../components';
import {
  CollectionAuthor,
  useGetAuthorsQuery,
} from '../../../api/generatedTypes';
import { useFetchMoreResults } from '../../../_shared/hooks';
import { config } from '../../../config';

/**
 * Author List Page
 */
export const AuthorListPage = (): JSX.Element => {
  const [loading, reloading, error, data, updateData] = useFetchMoreResults(
    useGetAuthorsQuery,
    {
      variables: {
        perPage: config.pagination.authorsPerPage,
        page: 1,
      },
    }
  );

  return (
    <>
      <Box display="flex">
        <Box flexGrow={1} alignSelf="center">
          <h1>Authors</h1>
        </Box>
        <Box alignSelf="center">
          <Button
            component={Link}
            to="/collections/authors/add/"
            buttonType="hollow"
          >
            Add author
          </Button>
        </Box>
      </Box>

      {!data && <HandleApiResponse loading={loading} error={error} />}

      {data &&
        data.getCollectionAuthors.authors.map((author: CollectionAuthor) => {
          return <AuthorListCard key={author.externalId} author={author} />;
        })}

      {data && (
        <LoadMore
          buttonDisabled={
            data.getCollectionAuthors.authors.length ===
            data.getCollectionAuthors.pagination?.totalResults
          }
          loadMore={updateData}
          showSpinner={reloading}
        />
      )}
    </>
  );
};
