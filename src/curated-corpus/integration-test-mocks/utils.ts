import { DocumentNode } from '@apollo/client';

/**
 * Constructs a MockedProvider-compatible mock query/result object
 */
export const constructMock = (
  queryName: string,
  query: DocumentNode,
  data: any
) => {
  return {
    request: {
      query,
    },
    result: {
      data: {
        [queryName]: data,
      },
    },
  };
};
