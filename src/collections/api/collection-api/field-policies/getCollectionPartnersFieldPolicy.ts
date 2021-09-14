import { FieldPolicy } from '@apollo/client/cache/inmemory/policies';
import { mergePaginatedDataInCache } from '../helpers/mergePaginatedDataInCache';
import { readPaginatedDataFromCache } from '../helpers/readPaginatedDataFromCache';
import { CollectionPartnersResult } from '../generatedTypes';

/**
 * A field policy for the 'getCollectionPartners' query that is used
 * on the Partners page and also in the 'Partners' dropdown
 * in the 'Add/Edit Partnership' form.
 *
 * The field policy is required to implement caching on the frontend properly.
 */
export const getCollectionPartnersFieldPolicy: FieldPolicy<
  CollectionPartnersResult,
  CollectionPartnersResult,
  CollectionPartnersResult
> = {
  // Ignore all query variables when merging CollectionAuthor objects in the cache.
  keyArgs: false,

  // Merge the authors into a single list in the cache.
  merge: function (existing, incoming, options): CollectionPartnersResult {
    return mergePaginatedDataInCache(existing, incoming, options, 'partners');
  },

  // Read the right chunk of data from the cache
  read: function (existing, options): CollectionPartnersResult {
    return readPaginatedDataFromCache(existing, options, 'partners');
  },
};
