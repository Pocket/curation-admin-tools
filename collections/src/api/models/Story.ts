import { CollectionStory, CollectionStoryAuthor } from '../generatedTypes';

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
