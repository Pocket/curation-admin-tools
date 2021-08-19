import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@material-ui/core';
import {
  AuthorListCard,
  Button,
  HandleApiResponse,
  LoadMore,
} from '../../components';
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

  // We need to keep track of the current page for pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Keep track of whether we're doing an initial data load (which is captured
  // in the 'loading' variable or we're fetching data for subsequent pages
  const [reloading, setReloading] = useState(false);

  const RESULTS_PER_PAGE = 2; // TODO: reinstate the default 30
  const { loading, error, data, fetchMore } = useGetAuthorsQuery({
    variables: { perPage: RESULTS_PER_PAGE, page: currentPage },
  });

  /**
   * Send off a request to fetch data for the page requested
   */
  const updateData = () => {
    setReloading(true);

    // Refresh query results with another pageful of data. Bypasses cache
    fetchMore({
      variables: { perPage: RESULTS_PER_PAGE, page: currentPage + 1 },
    })
      .then(() => {
        setReloading(false);
        setCurrentPage(currentPage + 1);
      })
      .catch((error) => {
        // Show an error in a toast message, if any
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
