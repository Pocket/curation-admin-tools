import { CollectionsResult } from '../generatedTypes';
import { FieldPolicy } from '@apollo/client/cache/inmemory/policies';
import { mergePaginatedDataInCache } from '../helpers/mergePaginatedDataInCache';
import { readPaginatedDataFromCache } from '../helpers/readPaginatedDataFromCache';

/**
 * A field policy for the 'searchCollections' query.
 *
 * The field policy is required to implement pagination on the frontend properly.
 */
export const searchCollectionsFieldPolicy: FieldPolicy<
  CollectionsResult,
  CollectionsResult,
  CollectionsResult
> = {
  // Group collections in the cache by the value of the 'Status' field
  // to be able to provide independent pagination to Draft/Published/Archived tabs.
  keyArgs: function (args) {
    // Collection status is hidden deep in the query arguments and cannot be
    // picked up by Apollo with a simple reference to 'status',
    // i.e. keyArgs: ['status'], so let's fish it out of the filters
    if (args) {
      return args.filters.status;
    }
    return false;
  },

  // Merge the collections into a single list in the cache, segmented by status
  // (see keyArgs function above).
  merge: function (existing, incoming, options): CollectionsResult {
    return mergePaginatedDataInCache(
      existing,
      incoming,
      options,
      'collections'
    );
  },

  // Read the right chunk of data from the cache
  read: function (existing, options): CollectionsResult {
    return readPaginatedDataFromCache(existing, options, 'collections');
  },
};
