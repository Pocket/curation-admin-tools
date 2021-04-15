import React from 'react';

import { AuthorListCard, Button, HandleApiResponse } from '../../components';
import { AuthorModel, useGetAuthors } from '../../api';
import { Box } from '@material-ui/core';

/**
 * Author List Page
 */
export const AuthorListPage = (): JSX.Element => {
  // Load authors
  const { loading, error, data } = useGetAuthors();

  return (
    <>
      <Box display="flex">
        <Box flexGrow={1} alignSelf="center">
          <h1>Authors</h1>
        </Box>
        <Box alignSelf="center">
          <Button buttonType="hollow">Add author</Button>
        </Box>
      </Box>

      {!data && <HandleApiResponse loading={loading} error={error} />}

      {data &&
        data.map((author: AuthorModel | null) => {
          return (
            author && <AuthorListCard key={author.externalId} author={author} />
          );
        })}
    </>
  );
};
