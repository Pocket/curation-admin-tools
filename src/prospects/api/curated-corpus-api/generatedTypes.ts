import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
const defaultOptions = {};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateString: any;
  /** A test string */
  PCTest: any;
  Url: any;
};

export type CuratedItem = {
  __typename?: 'CuratedItem';
  createdAt: Scalars['DateString'];
  createdBy: Scalars['String'];
  excerpt: Scalars['String'];
  externalId: Scalars['ID'];
  imageUrl?: Maybe<Scalars['Url']>;
  language: Scalars['String'];
  status: CuratedStatus;
  title: Scalars['String'];
  updatedAt: Scalars['DateString'];
  updatedBy?: Maybe<Scalars['String']>;
  url: Scalars['Url'];
};

/** Available fields for filtering CuratedItems */
export type CuratedItemFilterInput = {
  language?: Maybe<Scalars['String']>;
  status?: Maybe<CuratedStatus>;
  title?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['Url']>;
};

/** Available fields for sorting Curated Items */
export type CuratedItemOrderByInput = {
  createdAt?: Maybe<OrderBy>;
  updatedAt?: Maybe<OrderBy>;
};

export type CuratedItemsResult = {
  __typename?: 'CuratedItemsResult';
  items: Array<CuratedItem>;
  pagination?: Maybe<Pagination>;
};

export enum CuratedStatus {
  Corpus = 'CORPUS',
  Decline = 'DECLINE',
  Recommendation = 'RECOMMENDATION',
}

export enum OrderBy {
  Asc = 'asc',
  Desc = 'desc',
}

export type Pagination = {
  __typename?: 'Pagination';
  currentPage: Scalars['Int'];
  perPage: Scalars['Int'];
  totalPages: Scalars['Int'];
  totalResults: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  /** Retrieves a paged, sortable, filterable list of CuratedItems. */
  getCuratedItems: CuratedItemsResult;
};

export type QueryGetCuratedItemsArgs = {
  filters?: Maybe<CuratedItemFilterInput>;
  orderBy?: Maybe<CuratedItemOrderByInput>;
  page?: Maybe<Scalars['Int']>;
  perPage?: Maybe<Scalars['Int']>;
};

export type GetCuratedItemsQueryVariables = Exact<{
  page?: Maybe<Scalars['Int']>;
  perPage?: Maybe<Scalars['Int']>;
}>;

export type GetCuratedItemsQuery = {
  __typename?: 'Query';
  getCuratedItems: {
    __typename?: 'CuratedItemsResult';
    items: Array<{
      __typename?: 'CuratedItem';
      externalId: string;
      title: string;
      language: string;
      url: any;
      imageUrl?: Maybe<any>;
      excerpt: string;
      status: CuratedStatus;
      createdBy: string;
      createdAt: any;
      updatedAt: any;
    }>;
    pagination?: Maybe<{
      __typename?: 'Pagination';
      currentPage: number;
      totalPages: number;
      totalResults: number;
      perPage: number;
    }>;
  };
};

export const GetCuratedItemsDocument = gql`
  query getCuratedItems($page: Int, $perPage: Int) {
    getCuratedItems(page: $page, perPage: $perPage) {
      items {
        externalId
        title
        language
        url
        imageUrl
        excerpt
        status
        createdBy
        createdAt
        updatedAt
      }
      pagination {
        currentPage
        totalPages
        totalResults
        perPage
      }
    }
  }
`;

/**
 * __useGetCuratedItemsQuery__
 *
 * To run a query within a React component, call `useGetCuratedItemsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCuratedItemsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCuratedItemsQuery({
 *   variables: {
 *      page: // value for 'page'
 *      perPage: // value for 'perPage'
 *   },
 * });
 */
export function useGetCuratedItemsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetCuratedItemsQuery,
    GetCuratedItemsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetCuratedItemsQuery, GetCuratedItemsQueryVariables>(
    GetCuratedItemsDocument,
    options
  );
}
export function useGetCuratedItemsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetCuratedItemsQuery,
    GetCuratedItemsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetCuratedItemsQuery,
    GetCuratedItemsQueryVariables
  >(GetCuratedItemsDocument, options);
}
export type GetCuratedItemsQueryHookResult = ReturnType<
  typeof useGetCuratedItemsQuery
>;
export type GetCuratedItemsLazyQueryHookResult = ReturnType<
  typeof useGetCuratedItemsLazyQuery
>;
export type GetCuratedItemsQueryResult = Apollo.QueryResult<
  GetCuratedItemsQuery,
  GetCuratedItemsQueryVariables
>;
