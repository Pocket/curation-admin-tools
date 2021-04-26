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
  excerpt: Scalars['Markdown'];
  status: CollectionStatus;
  intro?: Maybe<Scalars['Markdown']>;
  imageUrl?: Maybe<Scalars['Url']>;
  publishedAt?: Maybe<Scalars['DateString']>;
  authors?: Maybe<Array<Maybe<CollectionAuthor>>>;
  stories?: Maybe<Array<Maybe<CollectionStory>>>;
};

export type CollectionAuthor = {
  __typename?: 'CollectionAuthor';
  externalId: Scalars['ID'];
  name: Scalars['String'];
  slug?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['Markdown']>;
  imageUrl?: Maybe<Scalars['Url']>;
  active?: Maybe<Scalars['Boolean']>;
};

export type CollectionAuthorsResult = {
  __typename?: 'CollectionAuthorsResult';
  pagination?: Maybe<Pagination>;
  authors?: Maybe<Array<Maybe<CollectionAuthor>>>;
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
  authors?: Maybe<Array<Maybe<CollectionStoryAuthor>>>;
  publisher?: Maybe<Scalars['String']>;
  sortOrder?: Maybe<Scalars['Int']>;
  item?: Maybe<Item>;
};

export type CollectionStoryAuthor = {
  __typename?: 'CollectionStoryAuthor';
  name: Scalars['String'];
};

export type CollectionStoryAuthorInput = {
  name: Scalars['String'];
};

export type CollectionsResult = {
  __typename?: 'CollectionsResult';
  pagination?: Maybe<Pagination>;
  collections?: Maybe<Array<Maybe<Collection>>>;
};

export type CreateCollectionAuthorInput = {
  name: Scalars['String'];
  slug?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['Markdown']>;
  imageUrl?: Maybe<Scalars['Url']>;
};

export type CreateCollectionInput = {
  slug: Scalars['String'];
  title: Scalars['String'];
  excerpt?: Maybe<Scalars['Markdown']>;
  intro?: Maybe<Scalars['Markdown']>;
  imageUrl?: Maybe<Scalars['String']>;
  status?: Maybe<CollectionStatus>;
  authorExternalId: Scalars['String'];
};

export type CreateCollectionStoryInput = {
  collectionExternalId: Scalars['String'];
  url: Scalars['Url'];
  title: Scalars['String'];
  excerpt: Scalars['Markdown'];
  imageUrl: Scalars['Url'];
  authors: Array<Maybe<CollectionStoryAuthorInput>>;
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
  createCollectionAuthor?: Maybe<CollectionAuthor>;
  updateCollectionAuthor?: Maybe<CollectionAuthor>;
  createCollection?: Maybe<Collection>;
  updateCollection?: Maybe<Collection>;
  createCollectionStory?: Maybe<CollectionStory>;
  updateCollectionStory?: Maybe<CollectionStory>;
  deleteCollectionStory?: Maybe<CollectionStory>;
};

export type MutationCreateCollectionAuthorArgs = {
  data?: Maybe<CreateCollectionAuthorInput>;
};

export type MutationUpdateCollectionAuthorArgs = {
  data?: Maybe<UpdateCollectionAuthorInput>;
};

export type MutationCreateCollectionArgs = {
  data?: Maybe<CreateCollectionInput>;
};

export type MutationUpdateCollectionArgs = {
  data?: Maybe<UpdateCollectionInput>;
};

export type MutationCreateCollectionStoryArgs = {
  data?: Maybe<CreateCollectionStoryInput>;
};

export type MutationUpdateCollectionStoryArgs = {
  data?: Maybe<UpdateCollectionStoryInput>;
};

export type MutationDeleteCollectionStoryArgs = {
  externalId: Scalars['String'];
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
  searchCollections?: Maybe<CollectionsResult>;
  /** Retrieves a Collection by externalId. */
  getCollection?: Maybe<Collection>;
  /** Retrieves a CollectionAuthor by externalId. */
  getCollectionAuthor?: Maybe<CollectionAuthor>;
  /** Retrieves a paged list of CollectionAuthors. */
  getCollectionAuthors?: Maybe<CollectionAuthorsResult>;
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
  collectionId: Scalars['Int'];
  url?: Maybe<Scalars['String']>;
};

export type SearchCollectionsFilters = {
  author?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  status?: Maybe<CollectionStatus>;
};

export type UpdateCollectionAuthorInput = {
  externalId: Scalars['String'];
  name: Scalars['String'];
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
  imageUrl?: Maybe<Scalars['String']>;
  status: CollectionStatus;
  authorExternalId: Scalars['String'];
};

export type UpdateCollectionStoryInput = {
  externalId: Scalars['String'];
  url: Scalars['Url'];
  title: Scalars['String'];
  excerpt: Scalars['Markdown'];
  imageUrl: Scalars['Url'];
  authors: Array<Maybe<CollectionStoryAuthorInput>>;
  publisher: Scalars['String'];
  sortOrder?: Maybe<Scalars['Int']>;
};

export type _Entity = CollectionStory | Item;

export type _Service = {
  __typename?: '_Service';
  /** The sdl representing the federated service capabilities. Includes federation directives, removes federation types, and includes rest of full schema after schema directives have been applied */
  sdl?: Maybe<Scalars['String']>;
};

export type CreateCollectionAuthorMutationVariables = Exact<{
  name: Scalars['String'];
  slug?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['Markdown']>;
  imageUrl?: Maybe<Scalars['Url']>;
}>;

export type CreateCollectionAuthorMutation = { __typename?: 'Mutation' } & {
  createCollectionAuthor?: Maybe<
    { __typename?: 'CollectionAuthor' } & Pick<
      CollectionAuthor,
      'externalId' | 'name'
    >
  >;
};

export type GetAuthorByIdQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type GetAuthorByIdQuery = { __typename?: 'Query' } & {
  getCollectionAuthor?: Maybe<
    { __typename?: 'CollectionAuthor' } & Pick<
      CollectionAuthor,
      'externalId' | 'name' | 'slug' | 'bio' | 'imageUrl' | 'active'
    >
  >;
};

export type GetAuthorsQueryVariables = Exact<{ [key: string]: never }>;

export type GetAuthorsQuery = { __typename?: 'Query' } & {
  getCollectionAuthors?: Maybe<
    { __typename?: 'CollectionAuthorsResult' } & {
      authors?: Maybe<
        Array<
          Maybe<
            { __typename?: 'CollectionAuthor' } & Pick<
              CollectionAuthor,
              'externalId' | 'name' | 'slug' | 'bio' | 'imageUrl' | 'active'
            >
          >
        >
      >;
    }
  >;
};

export type GetCollectionByIdQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type GetCollectionByIdQuery = { __typename?: 'Query' } & {
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
    >
  >;
};

export type GetDraftCollectionsQueryVariables = Exact<{ [key: string]: never }>;

export type GetDraftCollectionsQuery = { __typename?: 'Query' } & {
  searchCollections?: Maybe<
    { __typename?: 'CollectionsResult' } & {
      collections?: Maybe<
        Array<
          Maybe<
            { __typename?: 'Collection' } & Pick<
              Collection,
              | 'externalId'
              | 'title'
              | 'slug'
              | 'excerpt'
              | 'intro'
              | 'imageUrl'
              | 'status'
            >
          >
        >
      >;
    }
  >;
};

export const CreateCollectionAuthorDocument = gql`
  mutation createCollectionAuthor(
    $name: String!
    $slug: String
    $bio: Markdown
    $imageUrl: Url
  ) {
    createCollectionAuthor(
      data: { name: $name, slug: $slug, bio: $bio, imageUrl: $imageUrl }
    ) {
      externalId
      name
    }
  }
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
export const GetAuthorByIdDocument = gql`
  query getAuthorById($id: String!) {
    getCollectionAuthor(externalId: $id) {
      externalId
      name
      slug
      bio
      imageUrl
      active
    }
  }
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
        externalId
        name
        slug
        bio
        imageUrl
        active
      }
    }
  }
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
export const GetCollectionByIdDocument = gql`
  query getCollectionById($id: String!) {
    getCollection(externalId: $id) {
      externalId
      title
      slug
      excerpt
      intro
      imageUrl
      status
    }
  }
`;

/**
 * __useGetCollectionByIdQuery__
 *
 * To run a query within a React component, call `useGetCollectionByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCollectionByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCollectionByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetCollectionByIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetCollectionByIdQuery,
    GetCollectionByIdQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetCollectionByIdQuery,
    GetCollectionByIdQueryVariables
  >(GetCollectionByIdDocument, options);
}
export function useGetCollectionByIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetCollectionByIdQuery,
    GetCollectionByIdQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetCollectionByIdQuery,
    GetCollectionByIdQueryVariables
  >(GetCollectionByIdDocument, options);
}
export type GetCollectionByIdQueryHookResult = ReturnType<
  typeof useGetCollectionByIdQuery
>;
export type GetCollectionByIdLazyQueryHookResult = ReturnType<
  typeof useGetCollectionByIdLazyQuery
>;
export type GetCollectionByIdQueryResult = Apollo.QueryResult<
  GetCollectionByIdQuery,
  GetCollectionByIdQueryVariables
>;
export const GetDraftCollectionsDocument = gql`
  query getDraftCollections {
    searchCollections(filters: { status: DRAFT }) {
      collections {
        externalId
        title
        slug
        excerpt
        intro
        imageUrl
        status
      }
    }
  }
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
