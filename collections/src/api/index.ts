import { AuthorModel } from './models/Author';
import { CollectionModel } from './models/Collection';

/**
 * Client
 */
export { client } from './client';

/**
 * Models
 */
export type { AuthorModel };
export type { CollectionModel };
export { CollectionStatus } from './generatedTypes';
export type { Item, Author } from './client-api/generatedTypes';

/**
 * Hooks
 */
export {
  useGetAuthorsQuery,
  useGetAuthorByIdQuery,
  useGetDraftCollectionsQuery,
  useGetPublishedCollectionsQuery,
  useGetArchivedCollectionsQuery,
  useGetCollectionByIdQuery,
  useCreateCollectionAuthorMutation,
  useUpdateCollectionAuthorMutation,
  useCreateCollectionMutation,
  useUpdateCollectionMutation,
  useGetSearchCollectionsQuery,
} from './generatedTypes';

export {
  useGetStoryFromParserQuery
} from './client-api/generatedTypes'
