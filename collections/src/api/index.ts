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
