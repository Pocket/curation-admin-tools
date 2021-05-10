import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateString: any;
  Markdown: any;
  Upload: any;
  /** These are all just renamed strings right now */
  Url: any;
  _Any: any;
};

export enum CacheControlScope {
  Public = 'PUBLIC',
  Private = 'PRIVATE',
}

/**
 * TODO: add comments to all the fields in here!
 * there's a documentation ticket - do this in that ticket
 */
export type Collection = {
  __typename?: 'Collection';
  externalId: Scalars['ID'];
  slug: Scalars['String'];
  title: Scalars['String'];
  excerpt?: Maybe<Scalars['Markdown']>;
  status: CollectionStatus;
  intro?: Maybe<Scalars['Markdown']>;
  imageUrl?: Maybe<Scalars['Url']>;
  publishedAt?: Maybe<Scalars['DateString']>;
  authors: Array<CollectionAuthor>;
  stories: Array<CollectionStory>;
};

export type CollectionAuthor = {
  __typename?: 'CollectionAuthor';
  externalId: Scalars['ID'];
  name: Scalars['String'];
  slug?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['Markdown']>;
  imageUrl?: Maybe<Scalars['Url']>;
  active: Scalars['Boolean'];
};

export type CollectionAuthorsResult = {
  __typename?: 'CollectionAuthorsResult';
  pagination?: Maybe<Pagination>;
  authors: Array<CollectionAuthor>;
};

export type CollectionImageUploadInput = {
  image: Scalars['Upload'];
  width: Scalars['Int'];
  height: Scalars['Int'];
  fileSizeBytes: Scalars['Int'];
};

export type CollectionImageUrl = {
  __typename?: 'CollectionImageUrl';
  url: Scalars['String'];
};

export type CollectionInput = {
  title: Scalars['String'];
  excerpt: Scalars['String'];
};

export enum CollectionStatus {
  Draft = 'DRAFT',
  Published = 'PUBLISHED',
  Archived = 'ARCHIVED',
}

export type CollectionStory = {
  __typename?: 'CollectionStory';
  externalId: Scalars['ID'];
  url: Scalars['Url'];
  title: Scalars['String'];
  excerpt: Scalars['Markdown'];
  imageUrl?: Maybe<Scalars['Url']>;
  authors: Array<CollectionStoryAuthor>;
  publisher?: Maybe<Scalars['String']>;
  sortOrder?: Maybe<Scalars['Int']>;
  item?: Maybe<Item>;
};

export type CollectionStoryAuthor = {
  __typename?: 'CollectionStoryAuthor';
  name: Scalars['String'];
  sortOrder: Scalars['Int'];
};

export type CollectionStoryAuthorInput = {
  name: Scalars['String'];
  sortOrder: Scalars['Int'];
};

export type CollectionsResult = {
  __typename?: 'CollectionsResult';
  pagination: Pagination;
  collections: Array<Collection>;
};

export type CreateCollectionAuthorInput = {
  name: Scalars['String'];
  slug?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['Markdown']>;
  imageUrl?: Maybe<Scalars['Url']>;
  active?: Maybe<Scalars['Boolean']>;
};

export type CreateCollectionInput = {
  slug: Scalars['String'];
  title: Scalars['String'];
  excerpt?: Maybe<Scalars['Markdown']>;
  intro?: Maybe<Scalars['Markdown']>;
  imageUrl?: Maybe<Scalars['Url']>;
  status?: Maybe<CollectionStatus>;
  authorExternalId: Scalars['String'];
};

export type CreateCollectionStoryInput = {
  collectionExternalId: Scalars['String'];
  url: Scalars['Url'];
  title: Scalars['String'];
  excerpt: Scalars['Markdown'];
  imageUrl: Scalars['Url'];
  authors: Array<CollectionStoryAuthorInput>;
  publisher: Scalars['String'];
  sortOrder?: Maybe<Scalars['Int']>;
};

export type Item = {
  __typename?: 'Item';
  /** key field to identify the Item entity in the Parser service */
  givenUrl: Scalars['Url'];
  /** If the item is a collection allow them to get the collection information */
  collection?: Maybe<Collection>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createCollectionAuthor: CollectionAuthor;
  updateCollectionAuthor: CollectionAuthor;
  createCollection: Collection;
  updateCollection: Collection;
  createCollectionStory: CollectionStory;
  updateCollectionStory: CollectionStory;
  deleteCollectionStory: CollectionStory;
  collectionImageUpload: CollectionImageUrl;
};

export type MutationCreateCollectionAuthorArgs = {
  data: CreateCollectionAuthorInput;
};

export type MutationUpdateCollectionAuthorArgs = {
  data: UpdateCollectionAuthorInput;
};

export type MutationCreateCollectionArgs = {
  data: CreateCollectionInput;
};

export type MutationUpdateCollectionArgs = {
  data: UpdateCollectionInput;
};

export type MutationCreateCollectionStoryArgs = {
  data: CreateCollectionStoryInput;
};

export type MutationUpdateCollectionStoryArgs = {
  data: UpdateCollectionStoryInput;
};

export type MutationDeleteCollectionStoryArgs = {
  externalId: Scalars['String'];
};

export type MutationCollectionImageUploadArgs = {
  data: CollectionImageUploadInput;
};

export type Pagination = {
  __typename?: 'Pagination';
  currentPage: Scalars['Int'];
  totalPages: Scalars['Int'];
  totalResults: Scalars['Int'];
  perPage: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  _entities: Array<Maybe<_Entity>>;
  _service: _Service;
  searchCollections: CollectionsResult;
  /** Retrieves a Collection by externalId. */
  getCollection?: Maybe<Collection>;
  /** Retrieves a CollectionAuthor by externalId. */
  getCollectionAuthor?: Maybe<CollectionAuthor>;
  /** Retrieves a paged list of CollectionAuthors. */
  getCollectionAuthors: CollectionAuthorsResult;
  /** Retrieves a CollectionStory by a combination of collectionId and url. */
  getCollectionStory?: Maybe<CollectionStory>;
};

export type Query_EntitiesArgs = {
  representations: Array<Scalars['_Any']>;
};

export type QuerySearchCollectionsArgs = {
  filters: SearchCollectionsFilters;
  page?: Maybe<Scalars['Int']>;
  perPage?: Maybe<Scalars['Int']>;
};

export type QueryGetCollectionArgs = {
  externalId: Scalars['String'];
};

export type QueryGetCollectionAuthorArgs = {
  externalId: Scalars['String'];
};

export type QueryGetCollectionAuthorsArgs = {
  page?: Maybe<Scalars['Int']>;
  perPage?: Maybe<Scalars['Int']>;
};

export type QueryGetCollectionStoryArgs = {
  externalId: Scalars['String'];
};

export type SearchCollectionsFilters = {
  author?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  status?: Maybe<CollectionStatus>;
};

export type UpdateCollectionAuthorInput = {
  externalId: Scalars['String'];
  name: Scalars['String'];
  slug: Scalars['String'];
  bio?: Maybe<Scalars['Markdown']>;
  imageUrl?: Maybe<Scalars['Url']>;
  active?: Maybe<Scalars['Boolean']>;
};

export type UpdateCollectionInput = {
  externalId?: Maybe<Scalars['String']>;
  slug: Scalars['String'];
  title: Scalars['String'];
  excerpt: Scalars['Markdown'];
  intro?: Maybe<Scalars['Markdown']>;
  imageUrl?: Maybe<Scalars['Url']>;
  status: CollectionStatus;
  authorExternalId: Scalars['String'];
};

export type UpdateCollectionStoryInput = {
  externalId: Scalars['String'];
  url: Scalars['Url'];
  title: Scalars['String'];
  excerpt: Scalars['Markdown'];
  imageUrl: Scalars['Url'];
  authors: Array<CollectionStoryAuthorInput>;
  publisher: Scalars['String'];
  sortOrder?: Maybe<Scalars['Int']>;
};

export type _Entity = CollectionStory | Item;

export type _Service = {
  __typename?: '_Service';
  /** The sdl representing the federated service capabilities. Includes federation directives, removes federation types, and includes rest of full schema after schema directives have been applied */
  sdl?: Maybe<Scalars['String']>;
};

export type AuthorDataFragment = { __typename?: 'CollectionAuthor' } & Pick<
  CollectionAuthor,
  'externalId' | 'name' | 'slug' | 'bio' | 'imageUrl' | 'active'
>;

export type CollectionStoryDataFragment = {
  __typename?: 'CollectionStory';
} & Pick<
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
        'name' | 'sortOrder'
      >
    >;
  };

export type CreateCollectionMutationVariables = Exact<{
  title: Scalars['String'];
  slug: Scalars['String'];
  excerpt?: Maybe<Scalars['Markdown']>;
  intro?: Maybe<Scalars['Markdown']>;
  status: CollectionStatus;
  authorExternalId: Scalars['String'];
}>;

export type CreateCollectionMutation = { __typename?: 'Mutation' } & {
  createCollection: { __typename?: 'Collection' } & Pick<
    Collection,
    | 'externalId'
    | 'title'
    | 'slug'
    | 'excerpt'
    | 'intro'
    | 'imageUrl'
    | 'status'
  > & {
      authors: Array<{ __typename?: 'CollectionAuthor' } & AuthorDataFragment>;
    };
};

export type CreateCollectionAuthorMutationVariables = Exact<{
  name: Scalars['String'];
  slug?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['Markdown']>;
  imageUrl?: Maybe<Scalars['Url']>;
  active?: Maybe<Scalars['Boolean']>;
}>;

export type CreateCollectionAuthorMutation = { __typename?: 'Mutation' } & {
  createCollectionAuthor: {
    __typename?: 'CollectionAuthor';
  } & AuthorDataFragment;
};

export type CreateCollectionStoryMutationVariables = Exact<{
  collectionExternalId: Scalars['String'];
  url: Scalars['Url'];
  title: Scalars['String'];
  excerpt: Scalars['Markdown'];
  imageUrl: Scalars['Url'];
  authors: Array<CollectionStoryAuthorInput> | CollectionStoryAuthorInput;
  publisher: Scalars['String'];
  sortOrder?: Maybe<Scalars['Int']>;
}>;

export type CreateCollectionStoryMutation = { __typename?: 'Mutation' } & {
  createCollectionStory: {
    __typename?: 'CollectionStory';
  } & CollectionStoryDataFragment;
};

export type DeleteCollectionStoryMutationVariables = Exact<{
  externalId: Scalars['String'];
}>;

export type DeleteCollectionStoryMutation = { __typename?: 'Mutation' } & {
  deleteCollectionStory: { __typename?: 'CollectionStory' } & Pick<
    CollectionStory,
    'externalId'
  >;
};

export type UpdateCollectionMutationVariables = Exact<{
  externalId?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  slug: Scalars['String'];
  excerpt: Scalars['Markdown'];
  intro?: Maybe<Scalars['Markdown']>;
  status: CollectionStatus;
  authorExternalId: Scalars['String'];
}>;

export type UpdateCollectionMutation = { __typename?: 'Mutation' } & {
  updateCollection: { __typename?: 'Collection' } & Pick<
    Collection,
    | 'externalId'
    | 'title'
    | 'slug'
    | 'excerpt'
    | 'intro'
    | 'imageUrl'
    | 'status'
  > & {
      authors: Array<{ __typename?: 'CollectionAuthor' } & AuthorDataFragment>;
    };
};

export type UpdateCollectionAuthorMutationVariables = Exact<{
  externalId: Scalars['String'];
  name: Scalars['String'];
  slug: Scalars['String'];
  bio?: Maybe<Scalars['Markdown']>;
  imageUrl?: Maybe<Scalars['Url']>;
  active?: Maybe<Scalars['Boolean']>;
}>;

export type UpdateCollectionAuthorMutation = { __typename?: 'Mutation' } & {
  updateCollectionAuthor: {
    __typename?: 'CollectionAuthor';
  } & AuthorDataFragment;
};

export type UpdateCollectionStoryMutationVariables = Exact<{
  externalId: Scalars['String'];
  url: Scalars['Url'];
  title: Scalars['String'];
  excerpt: Scalars['Markdown'];
  imageUrl: Scalars['Url'];
  authors: Array<CollectionStoryAuthorInput> | CollectionStoryAuthorInput;
  publisher: Scalars['String'];
  sortOrder?: Maybe<Scalars['Int']>;
}>;

export type UpdateCollectionStoryMutation = { __typename?: 'Mutation' } & {
  updateCollectionStory: {
    __typename?: 'CollectionStory';
  } & CollectionStoryDataFragment;
};

export type GetArchivedCollectionsQueryVariables = Exact<{
  page?: Maybe<Scalars['Int']>;
  perPage?: Maybe<Scalars['Int']>;
}>;

export type GetArchivedCollectionsQuery = { __typename?: 'Query' } & {
  searchCollections: { __typename?: 'CollectionsResult' } & {
    collections: Array<
      { __typename?: 'Collection' } & Pick<
        Collection,
        | 'externalId'
        | 'title'
        | 'slug'
        | 'excerpt'
        | 'intro'
        | 'imageUrl'
        | 'status'
      > & {
          authors: Array<
            { __typename?: 'CollectionAuthor' } & AuthorDataFragment
          >;
        }
    >;
    pagination: { __typename?: 'Pagination' } & Pick<
      Pagination,
      'totalResults'
    >;
  };
};

export type GetAuthorByIdQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type GetAuthorByIdQuery = { __typename?: 'Query' } & {
  getCollectionAuthor?: Maybe<
    { __typename?: 'CollectionAuthor' } & AuthorDataFragment
  >;
};

export type GetAuthorsQueryVariables = Exact<{ [key: string]: never }>;

export type GetAuthorsQuery = { __typename?: 'Query' } & {
  getCollectionAuthors: { __typename?: 'CollectionAuthorsResult' } & {
    authors: Array<{ __typename?: 'CollectionAuthor' } & AuthorDataFragment>;
  };
};

export type GetCollectionByExternalIdQueryVariables = Exact<{
  externalId: Scalars['String'];
}>;

export type GetCollectionByExternalIdQuery = { __typename?: 'Query' } & {
  getCollection?: Maybe<
    { __typename?: 'Collection' } & Pick<
      Collection,
      | 'externalId'
      | 'title'
      | 'slug'
      | 'excerpt'
      | 'intro'
      | 'imageUrl'
      | 'status'
    > & {
        authors: Array<
          { __typename?: 'CollectionAuthor' } & AuthorDataFragment
        >;
      }
  >;
};

export type GetCollectionStoriesQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type GetCollectionStoriesQuery = { __typename?: 'Query' } & {
  getCollection?: Maybe<
    { __typename?: 'Collection' } & Pick<Collection, 'externalId'> & {
        stories: Array<
          { __typename?: 'CollectionStory' } & CollectionStoryDataFragment
        >;
      }
  >;
};

export type GetDraftCollectionsQueryVariables = Exact<{
  page?: Maybe<Scalars['Int']>;
  perPage?: Maybe<Scalars['Int']>;
}>;

export type GetDraftCollectionsQuery = { __typename?: 'Query' } & {
  searchCollections: { __typename?: 'CollectionsResult' } & {
    collections: Array<
      { __typename?: 'Collection' } & Pick<
        Collection,
        | 'externalId'
        | 'title'
        | 'slug'
        | 'excerpt'
        | 'intro'
        | 'imageUrl'
        | 'status'
      > & {
          authors: Array<
            { __typename?: 'CollectionAuthor' } & AuthorDataFragment
          >;
        }
    >;
    pagination: { __typename?: 'Pagination' } & Pick<
      Pagination,
      'totalResults'
    >;
  };
};

export type GetPublishedCollectionsQueryVariables = Exact<{
  page?: Maybe<Scalars['Int']>;
  perPage?: Maybe<Scalars['Int']>;
}>;

export type GetPublishedCollectionsQuery = { __typename?: 'Query' } & {
  searchCollections: { __typename?: 'CollectionsResult' } & {
    collections: Array<
      { __typename?: 'Collection' } & Pick<
        Collection,
        | 'externalId'
        | 'title'
        | 'slug'
        | 'excerpt'
        | 'intro'
        | 'imageUrl'
        | 'status'
      > & {
          authors: Array<
            { __typename?: 'CollectionAuthor' } & AuthorDataFragment
          >;
        }
    >;
    pagination: { __typename?: 'Pagination' } & Pick<
      Pagination,
      'totalResults'
    >;
  };
};

export type GetSearchCollectionsQueryVariables = Exact<{
  page?: Maybe<Scalars['Int']>;
  perPage?: Maybe<Scalars['Int']>;
  status?: Maybe<CollectionStatus>;
  author?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
}>;

export type GetSearchCollectionsQuery = { __typename?: 'Query' } & {
  searchCollections: { __typename?: 'CollectionsResult' } & {
    collections: Array<
      { __typename?: 'Collection' } & Pick<
        Collection,
        | 'externalId'
        | 'title'
        | 'slug'
        | 'excerpt'
        | 'intro'
        | 'imageUrl'
        | 'status'
      > & {
          authors: Array<
            { __typename?: 'CollectionAuthor' } & AuthorDataFragment
          >;
        }
    >;
    pagination: { __typename?: 'Pagination' } & Pick<
      Pagination,
      'totalResults'
    >;
  };
};

export const AuthorDataFragmentDoc = gql`
  fragment AuthorData on CollectionAuthor {
    externalId
    name
    slug
    bio
    imageUrl
    active
  }
`;
export const CollectionStoryDataFragmentDoc = gql`
  fragment CollectionStoryData on CollectionStory {
    externalId
    url
    title
    excerpt
    imageUrl
    authors {
      name
      sortOrder
    }
    publisher
    sortOrder
  }
`;
export const CreateCollectionDocument = gql`
  mutation createCollection(
    $title: String!
    $slug: String!
    $excerpt: Markdown
    $intro: Markdown
    $status: CollectionStatus!
    $authorExternalId: String!
  ) {
    createCollection(
      data: {
        title: $title
        slug: $slug
        excerpt: $excerpt
        intro: $intro
        status: $status
        authorExternalId: $authorExternalId
      }
    ) {
      externalId
      title
      slug
      excerpt
      intro
      imageUrl
      status
      authors {
        ...AuthorData
      }
    }
  }
  ${AuthorDataFragmentDoc}
`;
export type CreateCollectionMutationFn = Apollo.MutationFunction<
  CreateCollectionMutation,
  CreateCollectionMutationVariables
>;

/**
 * __useCreateCollectionMutation__
 *
 * To run a mutation, you first call `useCreateCollectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCollectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCollectionMutation, { data, loading, error }] = useCreateCollectionMutation({
 *   variables: {
 *      title: // value for 'title'
 *      slug: // value for 'slug'
 *      excerpt: // value for 'excerpt'
 *      intro: // value for 'intro'
 *      status: // value for 'status'
 *      authorExternalId: // value for 'authorExternalId'
 *   },
 * });
 */
export function useCreateCollectionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateCollectionMutation,
    CreateCollectionMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateCollectionMutation,
    CreateCollectionMutationVariables
  >(CreateCollectionDocument, options);
}
export type CreateCollectionMutationHookResult = ReturnType<
  typeof useCreateCollectionMutation
>;
export type CreateCollectionMutationResult = Apollo.MutationResult<CreateCollectionMutation>;
export type CreateCollectionMutationOptions = Apollo.BaseMutationOptions<
  CreateCollectionMutation,
  CreateCollectionMutationVariables
>;
export const CreateCollectionAuthorDocument = gql`
  mutation createCollectionAuthor(
    $name: String!
    $slug: String
    $bio: Markdown
    $imageUrl: Url
    $active: Boolean
  ) {
    createCollectionAuthor(
      data: {
        name: $name
        slug: $slug
        bio: $bio
        imageUrl: $imageUrl
        active: $active
      }
    ) {
      ...AuthorData
    }
  }
  ${AuthorDataFragmentDoc}
`;
export type CreateCollectionAuthorMutationFn = Apollo.MutationFunction<
  CreateCollectionAuthorMutation,
  CreateCollectionAuthorMutationVariables
>;

/**
 * __useCreateCollectionAuthorMutation__
 *
 * To run a mutation, you first call `useCreateCollectionAuthorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCollectionAuthorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCollectionAuthorMutation, { data, loading, error }] = useCreateCollectionAuthorMutation({
 *   variables: {
 *      name: // value for 'name'
 *      slug: // value for 'slug'
 *      bio: // value for 'bio'
 *      imageUrl: // value for 'imageUrl'
 *      active: // value for 'active'
 *   },
 * });
 */
export function useCreateCollectionAuthorMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateCollectionAuthorMutation,
    CreateCollectionAuthorMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateCollectionAuthorMutation,
    CreateCollectionAuthorMutationVariables
  >(CreateCollectionAuthorDocument, options);
}
export type CreateCollectionAuthorMutationHookResult = ReturnType<
  typeof useCreateCollectionAuthorMutation
>;
export type CreateCollectionAuthorMutationResult = Apollo.MutationResult<CreateCollectionAuthorMutation>;
export type CreateCollectionAuthorMutationOptions = Apollo.BaseMutationOptions<
  CreateCollectionAuthorMutation,
  CreateCollectionAuthorMutationVariables
>;
export const CreateCollectionStoryDocument = gql`
  mutation createCollectionStory(
    $collectionExternalId: String!
    $url: Url!
    $title: String!
    $excerpt: Markdown!
    $imageUrl: Url!
    $authors: [CollectionStoryAuthorInput!]!
    $publisher: String!
    $sortOrder: Int
  ) {
    createCollectionStory(
      data: {
        collectionExternalId: $collectionExternalId
        url: $url
        title: $title
        excerpt: $excerpt
        imageUrl: $imageUrl
        authors: $authors
        publisher: $publisher
        sortOrder: $sortOrder
      }
    ) {
      ...CollectionStoryData
    }
  }
  ${CollectionStoryDataFragmentDoc}
`;
export type CreateCollectionStoryMutationFn = Apollo.MutationFunction<
  CreateCollectionStoryMutation,
  CreateCollectionStoryMutationVariables
>;

/**
 * __useCreateCollectionStoryMutation__
 *
 * To run a mutation, you first call `useCreateCollectionStoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCollectionStoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCollectionStoryMutation, { data, loading, error }] = useCreateCollectionStoryMutation({
 *   variables: {
 *      collectionExternalId: // value for 'collectionExternalId'
 *      url: // value for 'url'
 *      title: // value for 'title'
 *      excerpt: // value for 'excerpt'
 *      imageUrl: // value for 'imageUrl'
 *      authors: // value for 'authors'
 *      publisher: // value for 'publisher'
 *      sortOrder: // value for 'sortOrder'
 *   },
 * });
 */
export function useCreateCollectionStoryMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateCollectionStoryMutation,
    CreateCollectionStoryMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateCollectionStoryMutation,
    CreateCollectionStoryMutationVariables
  >(CreateCollectionStoryDocument, options);
}
export type CreateCollectionStoryMutationHookResult = ReturnType<
  typeof useCreateCollectionStoryMutation
>;
export type CreateCollectionStoryMutationResult = Apollo.MutationResult<CreateCollectionStoryMutation>;
export type CreateCollectionStoryMutationOptions = Apollo.BaseMutationOptions<
  CreateCollectionStoryMutation,
  CreateCollectionStoryMutationVariables
>;
export const DeleteCollectionStoryDocument = gql`
  mutation deleteCollectionStory($externalId: String!) {
    deleteCollectionStory(externalId: $externalId) {
      externalId
    }
  }
`;
export type DeleteCollectionStoryMutationFn = Apollo.MutationFunction<
  DeleteCollectionStoryMutation,
  DeleteCollectionStoryMutationVariables
>;

/**
 * __useDeleteCollectionStoryMutation__
 *
 * To run a mutation, you first call `useDeleteCollectionStoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCollectionStoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCollectionStoryMutation, { data, loading, error }] = useDeleteCollectionStoryMutation({
 *   variables: {
 *      externalId: // value for 'externalId'
 *   },
 * });
 */
export function useDeleteCollectionStoryMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteCollectionStoryMutation,
    DeleteCollectionStoryMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    DeleteCollectionStoryMutation,
    DeleteCollectionStoryMutationVariables
  >(DeleteCollectionStoryDocument, options);
}
export type DeleteCollectionStoryMutationHookResult = ReturnType<
  typeof useDeleteCollectionStoryMutation
>;
export type DeleteCollectionStoryMutationResult = Apollo.MutationResult<DeleteCollectionStoryMutation>;
export type DeleteCollectionStoryMutationOptions = Apollo.BaseMutationOptions<
  DeleteCollectionStoryMutation,
  DeleteCollectionStoryMutationVariables
>;
export const UpdateCollectionDocument = gql`
  mutation updateCollection(
    $externalId: String
    $title: String!
    $slug: String!
    $excerpt: Markdown!
    $intro: Markdown
    $status: CollectionStatus!
    $authorExternalId: String!
  ) {
    updateCollection(
      data: {
        externalId: $externalId
        title: $title
        slug: $slug
        excerpt: $excerpt
        intro: $intro
        status: $status
        authorExternalId: $authorExternalId
      }
    ) {
      externalId
      title
      slug
      excerpt
      intro
      imageUrl
      status
      authors {
        ...AuthorData
      }
    }
  }
  ${AuthorDataFragmentDoc}
`;
export type UpdateCollectionMutationFn = Apollo.MutationFunction<
  UpdateCollectionMutation,
  UpdateCollectionMutationVariables
>;

/**
 * __useUpdateCollectionMutation__
 *
 * To run a mutation, you first call `useUpdateCollectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCollectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCollectionMutation, { data, loading, error }] = useUpdateCollectionMutation({
 *   variables: {
 *      externalId: // value for 'externalId'
 *      title: // value for 'title'
 *      slug: // value for 'slug'
 *      excerpt: // value for 'excerpt'
 *      intro: // value for 'intro'
 *      status: // value for 'status'
 *      authorExternalId: // value for 'authorExternalId'
 *   },
 * });
 */
export function useUpdateCollectionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateCollectionMutation,
    UpdateCollectionMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateCollectionMutation,
    UpdateCollectionMutationVariables
  >(UpdateCollectionDocument, options);
}
export type UpdateCollectionMutationHookResult = ReturnType<
  typeof useUpdateCollectionMutation
>;
export type UpdateCollectionMutationResult = Apollo.MutationResult<UpdateCollectionMutation>;
export type UpdateCollectionMutationOptions = Apollo.BaseMutationOptions<
  UpdateCollectionMutation,
  UpdateCollectionMutationVariables
>;
export const UpdateCollectionAuthorDocument = gql`
  mutation updateCollectionAuthor(
    $externalId: String!
    $name: String!
    $slug: String!
    $bio: Markdown
    $imageUrl: Url
    $active: Boolean
  ) {
    updateCollectionAuthor(
      data: {
        externalId: $externalId
        name: $name
        slug: $slug
        bio: $bio
        imageUrl: $imageUrl
        active: $active
      }
    ) {
      ...AuthorData
    }
  }
  ${AuthorDataFragmentDoc}
`;
export type UpdateCollectionAuthorMutationFn = Apollo.MutationFunction<
  UpdateCollectionAuthorMutation,
  UpdateCollectionAuthorMutationVariables
>;

/**
 * __useUpdateCollectionAuthorMutation__
 *
 * To run a mutation, you first call `useUpdateCollectionAuthorMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCollectionAuthorMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCollectionAuthorMutation, { data, loading, error }] = useUpdateCollectionAuthorMutation({
 *   variables: {
 *      externalId: // value for 'externalId'
 *      name: // value for 'name'
 *      slug: // value for 'slug'
 *      bio: // value for 'bio'
 *      imageUrl: // value for 'imageUrl'
 *      active: // value for 'active'
 *   },
 * });
 */
export function useUpdateCollectionAuthorMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateCollectionAuthorMutation,
    UpdateCollectionAuthorMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateCollectionAuthorMutation,
    UpdateCollectionAuthorMutationVariables
  >(UpdateCollectionAuthorDocument, options);
}
export type UpdateCollectionAuthorMutationHookResult = ReturnType<
  typeof useUpdateCollectionAuthorMutation
>;
export type UpdateCollectionAuthorMutationResult = Apollo.MutationResult<UpdateCollectionAuthorMutation>;
export type UpdateCollectionAuthorMutationOptions = Apollo.BaseMutationOptions<
  UpdateCollectionAuthorMutation,
  UpdateCollectionAuthorMutationVariables
>;
export const UpdateCollectionStoryDocument = gql`
  mutation updateCollectionStory(
    $externalId: String!
    $url: Url!
    $title: String!
    $excerpt: Markdown!
    $imageUrl: Url!
    $authors: [CollectionStoryAuthorInput!]!
    $publisher: String!
    $sortOrder: Int
  ) {
    updateCollectionStory(
      data: {
        externalId: $externalId
        url: $url
        title: $title
        excerpt: $excerpt
        imageUrl: $imageUrl
        authors: $authors
        publisher: $publisher
        sortOrder: $sortOrder
      }
    ) {
      ...CollectionStoryData
    }
  }
  ${CollectionStoryDataFragmentDoc}
`;
export type UpdateCollectionStoryMutationFn = Apollo.MutationFunction<
  UpdateCollectionStoryMutation,
  UpdateCollectionStoryMutationVariables
>;

/**
 * __useUpdateCollectionStoryMutation__
 *
 * To run a mutation, you first call `useUpdateCollectionStoryMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCollectionStoryMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCollectionStoryMutation, { data, loading, error }] = useUpdateCollectionStoryMutation({
 *   variables: {
 *      externalId: // value for 'externalId'
 *      url: // value for 'url'
 *      title: // value for 'title'
 *      excerpt: // value for 'excerpt'
 *      imageUrl: // value for 'imageUrl'
 *      authors: // value for 'authors'
 *      publisher: // value for 'publisher'
 *      sortOrder: // value for 'sortOrder'
 *   },
 * });
 */
export function useUpdateCollectionStoryMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateCollectionStoryMutation,
    UpdateCollectionStoryMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateCollectionStoryMutation,
    UpdateCollectionStoryMutationVariables
  >(UpdateCollectionStoryDocument, options);
}
export type UpdateCollectionStoryMutationHookResult = ReturnType<
  typeof useUpdateCollectionStoryMutation
>;
export type UpdateCollectionStoryMutationResult = Apollo.MutationResult<UpdateCollectionStoryMutation>;
export type UpdateCollectionStoryMutationOptions = Apollo.BaseMutationOptions<
  UpdateCollectionStoryMutation,
  UpdateCollectionStoryMutationVariables
>;
export const GetArchivedCollectionsDocument = gql`
  query getArchivedCollections($page: Int, $perPage: Int) {
    searchCollections(
      filters: { status: ARCHIVED }
      page: $page
      perPage: $perPage
    ) {
      collections {
        externalId
        title
        slug
        excerpt
        intro
        imageUrl
        status
        authors {
          ...AuthorData
        }
      }
      pagination {
        totalResults
      }
    }
  }
  ${AuthorDataFragmentDoc}
`;

/**
 * __useGetArchivedCollectionsQuery__
 *
 * To run a query within a React component, call `useGetArchivedCollectionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetArchivedCollectionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetArchivedCollectionsQuery({
 *   variables: {
 *      page: // value for 'page'
 *      perPage: // value for 'perPage'
 *   },
 * });
 */
export function useGetArchivedCollectionsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetArchivedCollectionsQuery,
    GetArchivedCollectionsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetArchivedCollectionsQuery,
    GetArchivedCollectionsQueryVariables
  >(GetArchivedCollectionsDocument, options);
}
export function useGetArchivedCollectionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetArchivedCollectionsQuery,
    GetArchivedCollectionsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetArchivedCollectionsQuery,
    GetArchivedCollectionsQueryVariables
  >(GetArchivedCollectionsDocument, options);
}
export type GetArchivedCollectionsQueryHookResult = ReturnType<
  typeof useGetArchivedCollectionsQuery
>;
export type GetArchivedCollectionsLazyQueryHookResult = ReturnType<
  typeof useGetArchivedCollectionsLazyQuery
>;
export type GetArchivedCollectionsQueryResult = Apollo.QueryResult<
  GetArchivedCollectionsQuery,
  GetArchivedCollectionsQueryVariables
>;
export const GetAuthorByIdDocument = gql`
  query getAuthorById($id: String!) {
    getCollectionAuthor(externalId: $id) {
      ...AuthorData
    }
  }
  ${AuthorDataFragmentDoc}
`;

/**
 * __useGetAuthorByIdQuery__
 *
 * To run a query within a React component, call `useGetAuthorByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAuthorByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAuthorByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetAuthorByIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetAuthorByIdQuery,
    GetAuthorByIdQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetAuthorByIdQuery, GetAuthorByIdQueryVariables>(
    GetAuthorByIdDocument,
    options
  );
}
export function useGetAuthorByIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetAuthorByIdQuery,
    GetAuthorByIdQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetAuthorByIdQuery, GetAuthorByIdQueryVariables>(
    GetAuthorByIdDocument,
    options
  );
}
export type GetAuthorByIdQueryHookResult = ReturnType<
  typeof useGetAuthorByIdQuery
>;
export type GetAuthorByIdLazyQueryHookResult = ReturnType<
  typeof useGetAuthorByIdLazyQuery
>;
export type GetAuthorByIdQueryResult = Apollo.QueryResult<
  GetAuthorByIdQuery,
  GetAuthorByIdQueryVariables
>;
export const GetAuthorsDocument = gql`
  query getAuthors {
    getCollectionAuthors {
      authors {
        ...AuthorData
      }
    }
  }
  ${AuthorDataFragmentDoc}
`;

/**
 * __useGetAuthorsQuery__
 *
 * To run a query within a React component, call `useGetAuthorsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAuthorsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAuthorsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAuthorsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetAuthorsQuery,
    GetAuthorsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetAuthorsQuery, GetAuthorsQueryVariables>(
    GetAuthorsDocument,
    options
  );
}
export function useGetAuthorsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetAuthorsQuery,
    GetAuthorsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetAuthorsQuery, GetAuthorsQueryVariables>(
    GetAuthorsDocument,
    options
  );
}
export type GetAuthorsQueryHookResult = ReturnType<typeof useGetAuthorsQuery>;
export type GetAuthorsLazyQueryHookResult = ReturnType<
  typeof useGetAuthorsLazyQuery
>;
export type GetAuthorsQueryResult = Apollo.QueryResult<
  GetAuthorsQuery,
  GetAuthorsQueryVariables
>;
export const GetCollectionByExternalIdDocument = gql`
  query getCollectionByExternalId($externalId: String!) {
    getCollection(externalId: $externalId) {
      externalId
      title
      slug
      excerpt
      intro
      imageUrl
      status
      authors {
        ...AuthorData
      }
    }
  }
  ${AuthorDataFragmentDoc}
`;

/**
 * __useGetCollectionByExternalIdQuery__
 *
 * To run a query within a React component, call `useGetCollectionByExternalIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCollectionByExternalIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCollectionByExternalIdQuery({
 *   variables: {
 *      externalId: // value for 'externalId'
 *   },
 * });
 */
export function useGetCollectionByExternalIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetCollectionByExternalIdQuery,
    GetCollectionByExternalIdQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetCollectionByExternalIdQuery,
    GetCollectionByExternalIdQueryVariables
  >(GetCollectionByExternalIdDocument, options);
}
export function useGetCollectionByExternalIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetCollectionByExternalIdQuery,
    GetCollectionByExternalIdQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetCollectionByExternalIdQuery,
    GetCollectionByExternalIdQueryVariables
  >(GetCollectionByExternalIdDocument, options);
}
export type GetCollectionByExternalIdQueryHookResult = ReturnType<
  typeof useGetCollectionByExternalIdQuery
>;
export type GetCollectionByExternalIdLazyQueryHookResult = ReturnType<
  typeof useGetCollectionByExternalIdLazyQuery
>;
export type GetCollectionByExternalIdQueryResult = Apollo.QueryResult<
  GetCollectionByExternalIdQuery,
  GetCollectionByExternalIdQueryVariables
>;
export const GetCollectionStoriesDocument = gql`
  query getCollectionStories($id: String!) {
    getCollection(externalId: $id) {
      externalId
      stories {
        ...CollectionStoryData
      }
    }
  }
  ${CollectionStoryDataFragmentDoc}
`;

/**
 * __useGetCollectionStoriesQuery__
 *
 * To run a query within a React component, call `useGetCollectionStoriesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCollectionStoriesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCollectionStoriesQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetCollectionStoriesQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetCollectionStoriesQuery,
    GetCollectionStoriesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetCollectionStoriesQuery,
    GetCollectionStoriesQueryVariables
  >(GetCollectionStoriesDocument, options);
}
export function useGetCollectionStoriesLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetCollectionStoriesQuery,
    GetCollectionStoriesQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetCollectionStoriesQuery,
    GetCollectionStoriesQueryVariables
  >(GetCollectionStoriesDocument, options);
}
export type GetCollectionStoriesQueryHookResult = ReturnType<
  typeof useGetCollectionStoriesQuery
>;
export type GetCollectionStoriesLazyQueryHookResult = ReturnType<
  typeof useGetCollectionStoriesLazyQuery
>;
export type GetCollectionStoriesQueryResult = Apollo.QueryResult<
  GetCollectionStoriesQuery,
  GetCollectionStoriesQueryVariables
>;
export const GetDraftCollectionsDocument = gql`
  query getDraftCollections($page: Int, $perPage: Int) {
    searchCollections(
      filters: { status: DRAFT }
      page: $page
      perPage: $perPage
    ) {
      collections {
        externalId
        title
        slug
        excerpt
        intro
        imageUrl
        status
        authors {
          ...AuthorData
        }
      }
      pagination {
        totalResults
      }
    }
  }
  ${AuthorDataFragmentDoc}
`;

/**
 * __useGetDraftCollectionsQuery__
 *
 * To run a query within a React component, call `useGetDraftCollectionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDraftCollectionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDraftCollectionsQuery({
 *   variables: {
 *      page: // value for 'page'
 *      perPage: // value for 'perPage'
 *   },
 * });
 */
export function useGetDraftCollectionsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetDraftCollectionsQuery,
    GetDraftCollectionsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetDraftCollectionsQuery,
    GetDraftCollectionsQueryVariables
  >(GetDraftCollectionsDocument, options);
}
export function useGetDraftCollectionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetDraftCollectionsQuery,
    GetDraftCollectionsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetDraftCollectionsQuery,
    GetDraftCollectionsQueryVariables
  >(GetDraftCollectionsDocument, options);
}
export type GetDraftCollectionsQueryHookResult = ReturnType<
  typeof useGetDraftCollectionsQuery
>;
export type GetDraftCollectionsLazyQueryHookResult = ReturnType<
  typeof useGetDraftCollectionsLazyQuery
>;
export type GetDraftCollectionsQueryResult = Apollo.QueryResult<
  GetDraftCollectionsQuery,
  GetDraftCollectionsQueryVariables
>;
export const GetPublishedCollectionsDocument = gql`
  query getPublishedCollections($page: Int, $perPage: Int) {
    searchCollections(
      filters: { status: PUBLISHED }
      page: $page
      perPage: $perPage
    ) {
      collections {
        externalId
        title
        slug
        excerpt
        intro
        imageUrl
        status
        authors {
          ...AuthorData
        }
      }
      pagination {
        totalResults
      }
    }
  }
  ${AuthorDataFragmentDoc}
`;

/**
 * __useGetPublishedCollectionsQuery__
 *
 * To run a query within a React component, call `useGetPublishedCollectionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPublishedCollectionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPublishedCollectionsQuery({
 *   variables: {
 *      page: // value for 'page'
 *      perPage: // value for 'perPage'
 *   },
 * });
 */
export function useGetPublishedCollectionsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetPublishedCollectionsQuery,
    GetPublishedCollectionsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetPublishedCollectionsQuery,
    GetPublishedCollectionsQueryVariables
  >(GetPublishedCollectionsDocument, options);
}
export function useGetPublishedCollectionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetPublishedCollectionsQuery,
    GetPublishedCollectionsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetPublishedCollectionsQuery,
    GetPublishedCollectionsQueryVariables
  >(GetPublishedCollectionsDocument, options);
}
export type GetPublishedCollectionsQueryHookResult = ReturnType<
  typeof useGetPublishedCollectionsQuery
>;
export type GetPublishedCollectionsLazyQueryHookResult = ReturnType<
  typeof useGetPublishedCollectionsLazyQuery
>;
export type GetPublishedCollectionsQueryResult = Apollo.QueryResult<
  GetPublishedCollectionsQuery,
  GetPublishedCollectionsQueryVariables
>;
export const GetSearchCollectionsDocument = gql`
  query getSearchCollections(
    $page: Int
    $perPage: Int
    $status: CollectionStatus
    $author: String
    $title: String
  ) {
    searchCollections(
      filters: { status: $status, author: $author, title: $title }
      page: $page
      perPage: $perPage
    ) {
      collections {
        externalId
        title
        slug
        excerpt
        intro
        imageUrl
        status
        authors {
          ...AuthorData
        }
      }
      pagination {
        totalResults
      }
    }
  }
  ${AuthorDataFragmentDoc}
`;

/**
 * __useGetSearchCollectionsQuery__
 *
 * To run a query within a React component, call `useGetSearchCollectionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSearchCollectionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSearchCollectionsQuery({
 *   variables: {
 *      page: // value for 'page'
 *      perPage: // value for 'perPage'
 *      status: // value for 'status'
 *      author: // value for 'author'
 *      title: // value for 'title'
 *   },
 * });
 */
export function useGetSearchCollectionsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetSearchCollectionsQuery,
    GetSearchCollectionsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetSearchCollectionsQuery,
    GetSearchCollectionsQueryVariables
  >(GetSearchCollectionsDocument, options);
}
export function useGetSearchCollectionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetSearchCollectionsQuery,
    GetSearchCollectionsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetSearchCollectionsQuery,
    GetSearchCollectionsQueryVariables
  >(GetSearchCollectionsDocument, options);
}
export type GetSearchCollectionsQueryHookResult = ReturnType<
  typeof useGetSearchCollectionsQuery
>;
export type GetSearchCollectionsLazyQueryHookResult = ReturnType<
  typeof useGetSearchCollectionsLazyQuery
>;
export type GetSearchCollectionsQueryResult = Apollo.QueryResult<
  GetSearchCollectionsQuery,
  GetSearchCollectionsQueryVariables
>;
