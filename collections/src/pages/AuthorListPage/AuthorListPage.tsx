import React from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@material-ui/core';
import { AuthorListCard, Button, HandleApiResponse } from '../../components';
import { AuthorModel } from '../../api';
import { useGetAuthorsQuery } from '../../api/generatedTypes';

/**
 * Author List Page
 */
export const AuthorListPage = (): JSX.Element => {
  // Load authors
  const { loading, error, data } = useGetAuthorsQuery();

  return (
    <>
      <Box display="flex">
        <Box flexGrow={1} alignSelf="center">
          <h1>Authors</h1>
        </Box>
        <Box alignSelf="center">
          <Button component={Link} to="/authors/add/" buttonType="hollow">
            Add author
          </Button>
        </Box>
      </Box>

      {!data && <HandleApiResponse loading={loading} error={error} />}

      {data &&
        data.getCollectionAuthors?.authors?.map(
          (author: AuthorModel | null) => {
            return (
              author && (
                <AuthorListCard key={author.externalId} author={author} />
              )
            );
          }
        )}
    </>
  );
};
