import { AuthorModel } from './models/Author';
import { CollectionModel } from './models/Collection';
import { StoryModel } from './models/Story';

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
export type { StoryModel };

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
  useGetSearchCollectionsLazyQuery,
} from './generatedTypes';

export { useGetStoryFromParserQuery } from './client-api/generatedTypes';
