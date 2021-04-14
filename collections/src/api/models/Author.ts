import { Author, Collection, Maybe } from '../generatedTypes';

/**
 * Shorthand for types returned by Apollo
 */
export type AuthorModel = { __typename?: 'Author' } & Pick<
  Author,
  | 'externalId'
  | 'name'
  | 'slug'
  | 'bio'
  | 'imageUrl'
  | 'active'
  | 'createdAt'
  | 'updatedAt'
> & {
    Collections?: Maybe<
      Array<Maybe<{ __typename?: 'Collection' } & Pick<Collection, 'externalId'>>>
    >;
  };
