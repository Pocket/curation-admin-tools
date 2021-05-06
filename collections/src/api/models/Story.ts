import {
  CollectionStory,
  CollectionStoryAuthor,
  Item,
  Maybe,
  Scalars,
} from '../generatedTypes';

export type StoryModel = { __typename?: 'CollectionStory' } & Pick<
  CollectionStory,
  | 'externalId'
  | 'url'
  | 'title'
  | 'excerpt'
  | 'imageUrl'
  | 'publisher'
  | 'sortOrder'
> & {
    authors: Array<
      { __typename?: 'CollectionStoryAuthor' } & Pick<
        CollectionStoryAuthor,
        'name'
      >
    >;
  };
