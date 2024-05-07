import { SafeReadonly } from '@apollo/client/cache/core/types/common';
import { FieldFunctionOptions } from '@apollo/client/cache/inmemory/policies';

/**
 * A helper function that returns the right slice of paginated data for a query.
 *
 * @param existing
 * @param options
 * @param dataPropName
 */
export const readPaginatedDataFromCache = (
  existing: SafeReadonly<any>,
  options: FieldFunctionOptions,
  dataPropName: string,
) => {
  const { args } = options;

  if (!args) {
    return existing;
  } else {
    // Args object always returns 'page: 1' when it should return the actual page
    // requested in follow-up fetchMore() calls ¯\_(ツ)_/¯.
    // Work around this by using the data returned with the query
    // in the `pagination` object.
    const currentPage =
      existing && existing.pagination
        ? existing.pagination.currentPage
        : args.page;

    const offset = (currentPage - 1) * args.perPage;

    // Always return the data from the first item in the cache array
    // so that on each subsequent click of the "Load more..." button
    // the old results are delivered alongside with a page's worth
    // of new ones.
    const pagefulOfData =
      existing && existing[dataPropName].slice(0, offset + args.perPage);

    // Only return values if there's actually something in the cache.
    // If nothing is returned from this function, Apollo Client will
    // attempt to fetch fresh data from the GraphQL API.
    if (pagefulOfData && pagefulOfData.length > 0) {
      return {
        [dataPropName]: pagefulOfData,
        pagination: existing.pagination,
      };
    }
  }
};
