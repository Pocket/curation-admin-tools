import { ApolloError } from '@apollo/client';
import { AuthorModel } from './models/Author';
import { CollectionModel } from './models/Collection';

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
export type { CollectionModel };

/**
 * Custom Hooks
 */
export { useGetAuthors } from './hooks/useGetAuthors';
export { useGetAuthorById } from './hooks/useGetAuthorById';
export { useGetCollections } from './hooks/useGetCollections';
export { useGetCollectionById } from './hooks/useGetCollectionById';
