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
  dataPropName: string
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

    // If we read the field before any data has been written to the
    // cache, this function will return undefined, which correctly
    // indicates that the field is missing.
    const pagefulOfData =
      existing && existing[dataPropName].slice(offset, offset + args.perPage);

    // If we ask for a page outside the bounds of the existing array,
    // page.length will be 0, and we should return undefined instead of
    // the empty array.
    if (pagefulOfData && pagefulOfData.length > 0) {
      return {
        [dataPropName]: pagefulOfData,
        pagination: existing.pagination,
      };
    }
  }
};
