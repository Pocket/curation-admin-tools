import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box } from '@material-ui/core';
import { Pagination, PaginationItem } from '@material-ui/lab';
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
  const RESULTS_PER_PAGE = 4; // TODO: reinstate the default 50

  // get query string parameters (they may contain a page number)
  const params = new URLSearchParams(useLocation().search);

  // We need to keep track of the current page for pagination
  const [currentPage, setCurrentPage] = useState(
    params.has('page') ? parseInt(params.get('page')!, 10) : 1
  );

  // Keep track of whether we're doing an initial data load (which is captured
  // in the 'loading' variable or we're fetching data for subsequent pages
  const [reloading, setReloading] = useState(false);

  const { loading, error, data, refetch } = useGetAuthorsQuery({
    variables: { perPage: RESULTS_PER_PAGE, page: currentPage },
  });

  /**
   * Send off a request to fetch data for the page requested
   *
   * @param event
   * @param value The page number the user has clicked on in the Pagination widget
   */
  const updateData = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);

    if (refetch) {
      // let's hide the data that's already on display
      setReloading(true);

      // Refresh query results with another pageful of data. Bypasses cache
      refetch({ perPage: RESULTS_PER_PAGE, page: value })
        .then(() => {
          setReloading(false);
        })
        .catch((error) => {
          // Show an error in a toast message, if any
          showNotification(error.message, 'error');
        });
    }
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

      {(!data || (data && reloading)) && (
        <HandleApiResponse loading={loading} error={error} />
      )}

      {data &&
        !reloading &&
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
            renderItem={(item) => (
              <PaginationItem
                component={Link}
                to={`/authors/${item.page === 1 ? '' : `?page=${item.page}`}`}
                {...item}
              />
            )}
            onChange={updateData}
          />
        </Box>
      )}
    </>
  );
};
