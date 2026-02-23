import { useState } from 'react';
import * as Apollo from '@apollo/client';
import { ApolloError } from '@apollo/client';
import { useNotifications } from '../';

// 2026-02-23: after removing collections, this function is not currently in
// use. leaving this in the code base as we may again need this functionality.

/**
 * This hook handles loading lists of data in paginated chunks:
 * coupled with field policies on queries, i.e. getCollectionAuthors,
 * this returns an initial pageful of data from the API or cache.
 * On subsequent user requests for more data, it requests the next pageful
 * from the GraphQL server.
 *
 * Returns the three standard Apollo Client useQuery hook variables:
 * loading, error and data, as well as a 'reloading' variable that indicates
 * request status for subsequent calls to the API, and an 'updateData' helper
 * function that can be attached to a UI element on the page and executed
 * on demand to fetch more results.
 *
 * @param queryHook
 * @param options
 */
export const useFetchMoreResults = (
  queryHook: any,
  options: Apollo.QueryHookOptions,
): [
  loading: boolean,
  reloading: boolean,
  error: ApolloError | undefined,
  data: any,
  updateData: () => void,
] => {
  const { showNotification } = useNotifications();

  // We need to keep track of the current page
  const [currentPage, setCurrentPage] = useState(options.variables?.page ?? 1);

  // Keep track of whether we're doing an initial data load (which is captured
  // in the 'loading' variable or we're fetching data for subsequent pagefuls
  // of data.
  const [reloading, setReloading] = useState(false);

  // Send a request for the data to Apollo Client
  const { loading, error, data, fetchMore } = queryHook(options);

  /**
   * Send off a request to fetch data for the next page's worth of results
   */
  const updateData = () => {
    setReloading(true);

    // Refresh query results with another pageful of data. Bypasses cache
    fetchMore({
      // Any other variables passed to the initial query remain the same,
      // only the 'page' variable will be overridden on subsequent calls
      // to the GraphQL server.
      variables: {
        page: currentPage + 1,
      },
    })
      .then(() => {
        setReloading(false);
        setCurrentPage(currentPage + 1);
      })
      .catch((error: ApolloError) => {
        // Show an error in a toast message, if any
        showNotification(error.message, 'error');
      });
  };

  return [loading, reloading, error, data, updateData];
};
