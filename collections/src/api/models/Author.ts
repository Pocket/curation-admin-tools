import { CollectionAuthor } from '../generatedTypes';

/**
 * Shorthand for types returned by Apollo
 */
export type AuthorModel = { __typename?: 'CollectionAuthor' } & Pick<
  CollectionAuthor,
  'externalId' | 'name' | 'slug' | 'bio' | 'imageUrl' | 'active'
>;
