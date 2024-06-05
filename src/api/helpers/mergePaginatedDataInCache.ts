import { SafeReadonly } from '@apollo/client/cache/core/types/common';
import { FieldFunctionOptions } from '@apollo/client/cache/inmemory/policies';

/**
 * A helper function that merges paginated data from a query into a single list
 * in Apollo Client cache.
 *
 * @param existing
 * @param incoming
 * @param options
 * @param dataPropName
 */
export const mergePaginatedDataInCache = (
  existing: SafeReadonly<any>,
  incoming: SafeReadonly<any>,
  options: FieldFunctionOptions,
  dataPropName: string,
) => {
  const { args } = options;

  if (!args || !existing) {
    return incoming;
  } else {
    // We only need to merge the data part of the result, i.e. 'authors' or 'collections'
    const mergedData = existing ? existing[dataPropName].slice(0) : [];

    // Insert the incoming elements in the right places, according to args.
    const offset = (args.page - 1) * args.perPage;
    const end = offset + Math.min(args.perPage, incoming[dataPropName].length);

    for (let i = offset; i < end; ++i) {
      mergedData[i] = incoming[dataPropName][i - offset];
    }

    // Return the merged list and the updated pagination values
    return {
      [dataPropName]: mergedData,
      pagination: incoming.pagination,
    };
  }
};
