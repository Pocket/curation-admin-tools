import { CollectionStory } from '../generatedTypes';

export type StoryModel = { __typename?: 'CollectionStory' } & Pick<
  CollectionStory,
  | 'externalId'
  | 'url'
  | 'title'
  | 'excerpt'
  | 'imageUrl'
  | 'authors'
  | 'publisher'
>;
