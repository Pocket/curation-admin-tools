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
  useGetCollectionByExternalIdQuery,
  useCreateCollectionAuthorMutation,
  useUpdateCollectionAuthorMutation,
  useCreateCollectionMutation,
  useUpdateCollectionMutation,
  useCreateCollectionStoryMutation,
  useUpdateCollectionStoryMutation,
  useDeleteCollectionStoryMutation,
  useUpdateCollectionStorySortOrderMutation,
  useGetSearchCollectionsLazyQuery,
  useGetCollectionStoriesQuery,
  useImageUploadMutation,
  useUpdateCollectionAuthorImageUrlMutation,
  useUpdateCollectionImageUrlMutation,
  useUpdateCollectionStoryImageUrlMutation,
} from './generatedTypes';
