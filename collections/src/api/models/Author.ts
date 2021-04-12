import { Author, Maybe } from '../generatedTypes';

/**
 * Shorthand for types returned by Apollo
 */
export type AuthorModel = Maybe<
  { __typename?: 'Author' | undefined } & Pick<
    Author,
    | 'id'
    | 'name'
    | 'slug'
    | 'bio'
    | 'imageUrl'
    | 'active'
    | 'createdAt'
    | 'updatedAt'
  >
>;
