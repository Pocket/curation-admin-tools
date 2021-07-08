import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@material-ui/core';
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
    // TODO: restore the default perPage value to 50
    // temporarily dropping this to 2 authors per page to demo pagination
    variables: { perPage: 2, page: 1 },
    // this setting is needed so that subsequent calls to fetchMore() helper
    // to bring in paginated data trigger component re-renders
    notifyOnNetworkStatusChange: true,
  });

  // We need to keep track of the current page for pagination
  const [currentPage, setCurrentPage] = useState(1);

  /**
   * Send off a request to fetch data for the page requested
   *
   * @param event
   * @param value The page number the user has clicked on in the Pagination widget
   */
  const updateData = () => {
    fetchMore({
      // Pass the page number the user would like to navigate to.
      // Everything else: the query document, the `perPage` value and any other
      // options are reused from the original useQuery() call above.
      variables: { page: currentPage + 1 },
    })
      .then((result) => {
        // update the current page number in state
        // this is used in the MUI Pagination component below
        setCurrentPage(currentPage + 1);

        // We don't need to do anything else here - fetchMore() resets values
        // destructured from the original query, i.e. `loading`, `data`
        // and the list should re-render as the call to the API is completed
      })
      .catch((error: Error) => {
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
        <Box display="flex" justifyContent="center" mt={2}>
          <Button
            variant="outlined"
            onClick={updateData}
            disabled={
              currentPage >= data.getCollectionAuthors.pagination?.totalPages!
            }
          >
            Load More
          </Button>
        </Box>
      )}
    </>
  );
};
