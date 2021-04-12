import { ApolloError } from '@apollo/client';
import { AuthorModel } from './models/Author';

/**
 * Client
 */
export { client } from './client';

/**
 * Models
 */
export interface ApiCallStates {
  loading: boolean;
  error: Error | ApolloError | undefined;
}

export type { AuthorModel };

// export interface AuthorListData {
//   data:
//     | undefined
//     | {
//         data: Author[] | null | undefined;
//       };
// }

/**
 * Custom Hooks
 */
export { useGetAuthors } from './hooks/useGetAuthors';
