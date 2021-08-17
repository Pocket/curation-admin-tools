import { CollectionAuthorsResult } from '../generatedTypes';
import { FieldPolicy } from '@apollo/client/cache/inmemory/policies';
import { mergePaginatedDataInCache } from '../helpers/mergePaginatedDataInCache';
import { readPaginatedDataFromCache } from '../helpers/readPaginatedDataFromCache';

/**
 * A field policy for the 'getCollectionAuthors' query that is used
 * on the Authors page and also in the 'Authors' dropdown in the 'Edit Collection'
 * form.
 * The field policy is required to implement pagination on the frontend properly.
 */
export const getCollectionAuthorsFieldPolicy: FieldPolicy<
  CollectionAuthorsResult,
  CollectionAuthorsResult,
  CollectionAuthorsResult
> = {
  // Ignore all query variables when merging CollectionAuthor objects in the cache.
  keyArgs: false,

  // Merge the authors into a single list in the cache.
  merge: function (existing, incoming, options): CollectionAuthorsResult {
    return mergePaginatedDataInCache(existing, incoming, options, 'authors');
  },

  // Read the right chunk of data from the cache
  read: function (existing, options): CollectionAuthorsResult {
    return readPaginatedDataFromCache(existing, options, 'authors');
  },
};
