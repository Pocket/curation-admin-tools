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
};

export type Author = {
  __typename?: 'Author';
  externalId: Scalars['String'];
  name: Scalars['String'];
  createdAt: Scalars['String'];
  active: Scalars['Boolean'];
  imageUrl: Scalars['String'];
  bio: Scalars['String'];
  updatedAt?: Maybe<Scalars['String']>;
  slug: Scalars['String'];
  Collections?: Maybe<Array<Maybe<Collection>>>;
};

export type AuthorFilter = {
  q?: Maybe<Scalars['String']>;
  ids?: Maybe<Array<Maybe<Scalars['ID']>>>;
  externalId?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  active?: Maybe<Scalars['Boolean']>;
  imageUrl?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
};

export type Collection = {
  __typename?: 'Collection';
  externalId: Scalars['String'];
  slug: Scalars['String'];
  title: Scalars['String'];
  excerpt: Scalars['String'];
  intro: Scalars['String'];
  imageUrl: Scalars['String'];
  status: Scalars['String'];
  updatedAt: Scalars['String'];
  createdAt: Scalars['String'];
  author_id: Scalars['ID'];
  Author?: Maybe<Author>;
};

export type CollectionFilter = {
  q?: Maybe<Scalars['String']>;
  ids?: Maybe<Array<Maybe<Scalars['ID']>>>;
  externalId?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  excerpt?: Maybe<Scalars['String']>;
  intro?: Maybe<Scalars['String']>;
  imageUrl?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  author_id?: Maybe<Scalars['ID']>;
};

export type ListMetadata = {
  __typename?: 'ListMetadata';
  count?: Maybe<Scalars['Int']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createAuthor?: Maybe<Author>;
  updateAuthor?: Maybe<Author>;
  removeAuthor?: Maybe<Scalars['Boolean']>;
  createCollection?: Maybe<Collection>;
  updateCollection?: Maybe<Collection>;
  removeCollection?: Maybe<Scalars['Boolean']>;
};

export type MutationCreateAuthorArgs = {
  externalId: Scalars['String'];
  name: Scalars['String'];
  createdAt: Scalars['String'];
  active: Scalars['Boolean'];
  imageUrl: Scalars['String'];
  bio: Scalars['String'];
  updatedAt?: Maybe<Scalars['String']>;
  slug: Scalars['String'];
};

export type MutationUpdateAuthorArgs = {
  externalId?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  active?: Maybe<Scalars['Boolean']>;
  imageUrl?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
};

export type MutationRemoveAuthorArgs = {
  id: Scalars['ID'];
};

export type MutationCreateCollectionArgs = {
  externalId: Scalars['String'];
  slug: Scalars['String'];
  title: Scalars['String'];
  excerpt: Scalars['String'];
  intro: Scalars['String'];
  imageUrl: Scalars['String'];
  status: Scalars['String'];
  updatedAt: Scalars['String'];
  createdAt: Scalars['String'];
  author_id: Scalars['ID'];
};

export type MutationUpdateCollectionArgs = {
  externalId?: Maybe<Scalars['String']>;
  slug?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  excerpt?: Maybe<Scalars['String']>;
  intro?: Maybe<Scalars['String']>;
  imageUrl?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  author_id?: Maybe<Scalars['ID']>;
};

export type MutationRemoveCollectionArgs = {
  id: Scalars['ID'];
};

export type Query = {
  __typename?: 'Query';
  Author?: Maybe<Author>;
  allAuthors?: Maybe<Array<Maybe<Author>>>;
  _allAuthorsMeta?: Maybe<ListMetadata>;
  Collection?: Maybe<Collection>;
  allCollections?: Maybe<Array<Maybe<Collection>>>;
  _allCollectionsMeta?: Maybe<ListMetadata>;
};

export type QueryAuthorArgs = {
  id: Scalars['ID'];
};

export type QueryAllAuthorsArgs = {
  page?: Maybe<Scalars['Int']>;
  perPage?: Maybe<Scalars['Int']>;
  sortField?: Maybe<Scalars['String']>;
  sortOrder?: Maybe<Scalars['String']>;
  filter?: Maybe<AuthorFilter>;
};

export type Query_AllAuthorsMetaArgs = {
  page?: Maybe<Scalars['Int']>;
  perPage?: Maybe<Scalars['Int']>;
  filter?: Maybe<AuthorFilter>;
};

export type QueryCollectionArgs = {
  id: Scalars['ID'];
};

export type QueryAllCollectionsArgs = {
  page?: Maybe<Scalars['Int']>;
  perPage?: Maybe<Scalars['Int']>;
  sortField?: Maybe<Scalars['String']>;
  sortOrder?: Maybe<Scalars['String']>;
  filter?: Maybe<CollectionFilter>;
};

export type Query_AllCollectionsMetaArgs = {
  page?: Maybe<Scalars['Int']>;
  perPage?: Maybe<Scalars['Int']>;
  filter?: Maybe<CollectionFilter>;
};

export type GetAuthorByIdQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type GetAuthorByIdQuery = { __typename?: 'Query' } & {
  allAuthors?: Maybe<
    Array<
      Maybe<
        { __typename?: 'Author' } & Pick<
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
              Array<
                Maybe<
                  { __typename?: 'Collection' } & Pick<Collection, 'externalId'>
                >
              >
            >;
          }
      >
    >
  >;
};

export type GetAuthorsQueryVariables = Exact<{ [key: string]: never }>;

export type GetAuthorsQuery = { __typename?: 'Query' } & {
  allAuthors?: Maybe<
    Array<
      Maybe<
        { __typename?: 'Author' } & Pick<
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
              Array<
                Maybe<
                  { __typename?: 'Collection' } & Pick<Collection, 'externalId'>
                >
              >
            >;
          }
      >
    >
  >;
};

export const GetAuthorByIdDocument = gql`
  query getAuthorById($id: String!) {
    allAuthors(filter: { externalId: $id }) {
      externalId
      name
      slug
      bio
      imageUrl
      active
      createdAt
      updatedAt
      Collections {
        externalId
      }
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
    allAuthors(sortField: "createdAt", sortOrder: "DESC") {
      externalId
      name
      slug
      bio
      imageUrl
      active
      createdAt
      updatedAt
      Collections {
        externalId
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
