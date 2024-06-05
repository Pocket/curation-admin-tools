import { DocumentNode } from '@apollo/client';

/**
 * Constructs a MockedProvider-compatible mock query/result object
 */
export const constructMock = (
  queryName: string,
  query: DocumentNode,
  variables: any,
  data: any,
) => {
  return {
    request: {
      query,
      variables,
    },
    result: {
      data: {
        [queryName]: data,
      },
    },
  };
};
