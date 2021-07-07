import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@material-ui/core';
import { Pagination } from '@material-ui/lab';
import { AuthorListCard, Button, HandleApiResponse } from '../../components';
import {
  CollectionAuthor,
  useGetAuthorsQuery,
} from '../../api/collection-api/generatedTypes';
import { useNotifications } from '../../hooks/useNotifications';

/**
 * Author List Page
 */
export const AuthorListPage = (): JSX.Element => {
  const { showNotification } = useNotifications();

  // Load authors
  const { loading, error, data, fetchMore } = useGetAuthorsQuery({
    variables: { perPage: 4, page: 1 },
    notifyOnNetworkStatusChange: true,
  });

  // We need to keep track of the current page for pagination
  const [currentPage, setCurrentPage] = useState(
    data?.getCollectionAuthors.pagination?.currentPage ?? 1
  );

  const updateData = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);

    fetchMore({
      variables: { page: value },
    })
      .then((result) => {
        // ???
      })
      .catch((error: Error) => {
        showNotification(error.message, 'error');
      });
  };
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
        data.getCollectionAuthors.authors.map((author: CollectionAuthor) => {
          return <AuthorListCard key={author.externalId} author={author} />;
        })}

      {data && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            key={`pagination-${currentPage}`}
            variant="outlined"
            color="primary"
            shape="rounded"
            count={data.getCollectionAuthors.pagination?.totalPages!}
            defaultPage={currentPage}
            onChange={updateData}
          />
        </Box>
      )}
    </>
  );
};
