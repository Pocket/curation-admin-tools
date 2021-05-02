import { Collection } from '../generatedTypes';

export type CollectionModel = { __typename?: 'Collection' } & Pick<
  Collection,
  | 'externalId'
  | 'title'
  | 'slug'
  | 'excerpt'
  | 'intro'
  | 'imageUrl'
  | 'status'
  | 'authors'
>;
