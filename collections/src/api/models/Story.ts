import {
  CollectionStory,
  CollectionStoryAuthor,
  Maybe,
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
    authors: Array<Maybe<StoryAuthorModel>>;
  };

export type StoryAuthorModel = { __typename?: 'CollectionStoryAuthor' } & Pick<
  CollectionStoryAuthor,
  'name' | 'sortOrder'
>;
