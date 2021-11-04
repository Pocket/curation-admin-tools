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
  /** A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: any;
  /** This is a temporary return type for a test query on the public API. */
  PCTest: any;
  /** A URL - usually, for an interesting story on the internet that's worth saving to Pocket. */
  Url: any;
};

/** Input data for creating a Curated Item and optionally scheduling this item to appear on New Tab. */
export type CreateCuratedItemInput = {
  /** The excerpt of the Curated Item. */
  excerpt: Scalars['String'];
  /** The image URL for this item's accompanying picture. */
  imageUrl: Scalars['Url'];
  /** Whether this story is a Pocket Collection. */
  isCollection: Scalars['Boolean'];
  /**
   * A flag to ML to not recommend this item long term after it is added to the corpus.
   * Example: a story covering an election.
   */
  isShortLived: Scalars['Boolean'];
  /** Whether this item is a syndicated article. */
  isSyndicated: Scalars['Boolean'];
  /** What language this item is in. This is a two-letter code, for example, 'en' for English. */
  language: Scalars['String'];
  /** Optionally, specify the external ID of the New Tab this item should be scheduled for. */
  newTabFeedExternalId?: Maybe<Scalars['ID']>;
  /** The name of the online publication that published this story. */
  publisher: Scalars['String'];
  /** Optionally, specify the date this item should be appearing on New Tab. Format: YYYY-MM-DD */
  scheduledDate?: Maybe<Scalars['Date']>;
  /** The outcome of the curators' review of the Curated Item. */
  status: CuratedStatus;
  /** The title of the Curated Item. */
  title: Scalars['String'];
  /**
   * A topic this story best fits in.
   * Temporarily a string value that will be provided by Prospect API, possibly an enum in the future.
   */
  topic: Scalars['String'];
  /** The URL of the Curated Item. */
  url: Scalars['Url'];
};

/** Input data for creating a scheduled entry for a Curated Item on a New Tab Feed. */
export type CreateNewTabFeedScheduledItemInput = {
  /** The ID of the Curated Item that needs to be scheduled. */
  curatedItemExternalId: Scalars['ID'];
  /** The ID of the New Tab Feed the Curated Item above is going to appear on. */
  newTabFeedExternalId: Scalars['ID'];
  /** The date the associated Curated Item is scheduled to appear on New Tab. Format: YYYY-MM-DD. */
  scheduledDate: Scalars['Date'];
};

/** A prospective story that has been reviewed by the curators and saved to the curated corpus. */
export type CuratedItem = {
  __typename?: 'CuratedItem';
  /** A Unix timestamp of when the entity was created. */
  createdAt: Scalars['Int'];
  /** A single sign-on user identifier of the user who created this entity. */
  createdBy: Scalars['String'];
  /** The excerpt of the story. */
  excerpt: Scalars['String'];
  /** An alternative primary key in UUID format that is generated on creation. */
  externalId: Scalars['ID'];
  /**
   * The image URL associated with the story.
   * This is a link to an S3 bucket - the image will have been pre-uploaded to S3 before saving a curated item.
   */
  imageUrl: Scalars['Url'];
  /** Whether this story is a Pocket Collection. */
  isCollection: Scalars['Boolean'];
  /**
   * A flag to ML to not recommend this item long term after it is added to the corpus.
   * Example: a story covering an election.
   */
  isShortLived: Scalars['Boolean'];
  /** Whether this item is a syndicated article. */
  isSyndicated: Scalars['Boolean'];
  /** What language this story is in. This is a two-letter code, for example, 'en' for English. */
  language: Scalars['String'];
  /** The name of the online publication that published this story. */
  publisher: Scalars['String'];
  /** The outcome of the curators' review. */
  status: CuratedStatus;
  /** The title of the story. */
  title: Scalars['String'];
  /**
   * A topic this story best fits in.
   * Temporarily a string value that will be provided by Prospect API, possibly an enum in the future.
   */
  topic: Scalars['String'];
  /** A Unix timestamp of when the entity was last updated. */
  updatedAt: Scalars['Int'];
  /** A single sign-on user identifier of the user who last updated this entity. Null on creation. */
  updatedBy?: Maybe<Scalars['String']>;
  /** The URL of the story. */
  url: Scalars['Url'];
};

/** The connection type for Curated Item. */
export type CuratedItemConnection = {
  __typename?: 'CuratedItemConnection';
  /** A list of edges. */
  edges: Array<CuratedItemEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of Curated Items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type CuratedItemEdge = {
  __typename?: 'CuratedItemEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The Curated Item at the end of the edge. */
  node: CuratedItem;
};

/** Available fields for filtering CuratedItems. */
export type CuratedItemFilter = {
  /**
   * Optional filter on the language Curated Items have been classified as.
   * This is a two-letter string, e.g. 'en' for English or 'de' for 'German'.
   */
  language?: Maybe<Scalars['String']>;
  /** Optional filter on the status of Curated Items. */
  status?: Maybe<CuratedStatus>;
  /** Optional filter on the title field. Returns partial matches. */
  title?: Maybe<Scalars['String']>;
  /** Optional filter on the topic field. */
  topic?: Maybe<Scalars['String']>;
  /** Optional filter on the URL field. Returns partial matches. */
  url?: Maybe<Scalars['Url']>;
};

/** The outcome of the curators reviewing a prospective story. */
export enum CuratedStatus {
  /** This story is suitable for our curated corpus. It's a second-tier recommendation. */
  Corpus = 'CORPUS',
  /** Recommend this story for Pocket users. This is first-tier content. */
  Recommendation = 'RECOMMENDATION',
}

/** Input data for deleting a scheduled item for a New Tab Feed. */
export type DeleteNewTabFeedScheduledItemInput = {
  /** ID of the scheduled item. A string in UUID format. */
  externalId: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Creates a Curated Item and optionally schedules it to appear on New Tab. */
  createCuratedItem: CuratedItem;
  /** Creates a New Tab Scheduled Item. */
  createNewTabFeedScheduledItem: NewTabFeedScheduledItem;
  /** Deletes an item from New Tab Schedule. */
  deleteNewTabFeedScheduledItem: NewTabFeedScheduledItem;
  /** Updates a Curated Item. */
  updateCuratedItem: CuratedItem;
};

export type MutationCreateCuratedItemArgs = {
  data: CreateCuratedItemInput;
};

export type MutationCreateNewTabFeedScheduledItemArgs = {
  data: CreateNewTabFeedScheduledItemInput;
};

export type MutationDeleteNewTabFeedScheduledItemArgs = {
  data: DeleteNewTabFeedScheduledItemInput;
};

export type MutationUpdateCuratedItemArgs = {
  data: UpdateCuratedItemInput;
};

/**
 * A scheduled entry for a Curated Item to appear on a New Tab Feed.
 * For example, a story that is scheduled to appear on December 31st, 2021 on the New Tab in Firefox for the US audience.
 */
export type NewTabFeedScheduledItem = {
  __typename?: 'NewTabFeedScheduledItem';
  /** A Unix timestamp of when the entity was created. */
  createdAt: Scalars['Int'];
  /** A single sign-on user identifier of the user who created this entity. */
  createdBy: Scalars['String'];
  /** The associated Curated Item. */
  curatedItem: CuratedItem;
  /** An alternative primary key in UUID format that is generated on creation. */
  externalId: Scalars['ID'];
  /**
   * The date the associated Curated Item is scheduled to appear on New Tab.
   * This date is relative to the time zone of the New Tab. Format: YYYY-MM-DD.
   */
  scheduledDate: Scalars['Date'];
  /** A Unix timestamp of when the entity was last updated. */
  updatedAt: Scalars['Int'];
  /** A single sign-on user identifier of the user who last updated this entity. Null on creation. */
  updatedBy?: Maybe<Scalars['String']>;
};

/** Available fields for filtering scheduled items for a given New Tab Feed. */
export type NewTabFeedScheduledItemsFilterInput = {
  /** To what day to show scheduled items to, inclusive. Expects a date in YYYY-MM-DD format. */
  endDate: Scalars['Date'];
  /** The ID of the New Tab Feed. A string in UUID format. */
  newTabExternalId: Scalars['ID'];
  /** Which day to show scheduled items from. Expects a date in YYYY-MM-DD format. */
  startDate: Scalars['Date'];
};

/** The shape of the result returned by the getNewTabFeedScheduledItems query. */
export type NewTabFeedScheduledItemsResult = {
  __typename?: 'NewTabFeedScheduledItemsResult';
  /** An array of items for a given New Tab Feed */
  items: Array<NewTabFeedScheduledItem>;
};

/** Options for returning items sorted by the supplied field. */
export enum OrderBy {
  /** Return items in ascending order. */
  Asc = 'ASC',
  /** Return items in descending order. */
  Desc = 'DESC',
}

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['String']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['String']>;
};

/**
 * Pagination request. To determine which edges to return, the connection
 * evaluates the `before` and `after` cursors (if given) to filter the
 * edges, then evaluates `first`/`last` to slice the edges (only include a
 * value for either `first` or `last`, not both). If all fields are null,
 * by default will return a page with the first 30 elements.
 */
export type PaginationInput = {
  /**
   * Returns the elements in the list that come after the specified cursor.
   * The specified cursor is not included in the result.
   */
  after?: Maybe<Scalars['String']>;
  /**
   * Returns the elements in the list that come before the specified cursor.
   * The specified cursor is not included in the result.
   */
  before?: Maybe<Scalars['String']>;
  /**
   * Returns the first _n_ elements from the list. Must be a non-negative integer.
   * If `first` contains a value, `last` should be null/omitted in the input.
   */
  first?: Maybe<Scalars['Int']>;
  /**
   * Returns the last _n_ elements from the list. Must be a non-negative integer.
   * If `last` contains a value, `first` should be null/omitted in the input.
   */
  last?: Maybe<Scalars['Int']>;
};

export type Query = {
  __typename?: 'Query';
  /** Retrieves a paginated, filterable list of CuratedItems. */
  getCuratedItems: CuratedItemConnection;
  /** Retrieves a list of Curated Items that are scheduled to appear on New Tab */
  getNewTabFeedScheduledItems: NewTabFeedScheduledItemsResult;
  /** Retrieves a paginated, filterable list of RejectedCuratedCorpusItems. */
  getRejectedCuratedCorpusItems: RejectedCuratedCorpusItemConnection;
};

export type QueryGetCuratedItemsArgs = {
  filters?: Maybe<CuratedItemFilter>;
  pagination?: Maybe<PaginationInput>;
};

export type QueryGetNewTabFeedScheduledItemsArgs = {
  filters: NewTabFeedScheduledItemsFilterInput;
};

export type QueryGetRejectedCuratedCorpusItemsArgs = {
  filters?: Maybe<RejectedCuratedCorpusItemFilter>;
  pagination?: Maybe<PaginationInput>;
};

/** A prospective story that has been rejected by the curators. */
export type RejectedCuratedCorpusItem = {
  __typename?: 'RejectedCuratedCorpusItem';
  /** A Unix timestamp of when the entity was created. */
  createdAt: Scalars['Int'];
  /** A single sign-on user identifier of the user who created this entity. */
  createdBy: Scalars['String'];
  /** An alternative primary key in UUID format that is generated on creation. */
  externalId: Scalars['ID'];
  /** What language this story is in. This is a two-letter code, for example, 'en' for English. */
  language: Scalars['String'];
  /** The name of the online publication that published this story. */
  publisher: Scalars['String'];
  /** Reason why it was rejected. Can be multiple reasons. Will likely be stored either as comma-separated values or JSON. */
  reason: Scalars['String'];
  /** The title of the story. */
  title: Scalars['String'];
  /**
   * A topic this story best fits in.
   * Temporarily a string value that will be provided by Prospect API, possibly an enum in the future.
   */
  topic: Scalars['String'];
  /** The URL of the story. */
  url: Scalars['Url'];
};

/** The connection type for Rejected Curated Item. */
export type RejectedCuratedCorpusItemConnection = {
  __typename?: 'RejectedCuratedCorpusItemConnection';
  /** A list of edges. */
  edges: Array<RejectedCuratedCorpusItemEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of Rejected Curated Items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection for RejectedCuratedCorpusItem type. */
export type RejectedCuratedCorpusItemEdge = {
  __typename?: 'RejectedCuratedCorpusItemEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The Rejected Curated Item at the end of the edge. */
  node: RejectedCuratedCorpusItem;
};

/** Available fields for filtering RejectedCuratedCorpusItems. */
export type RejectedCuratedCorpusItemFilter = {
  /**
   * Optional filter on the language Rejected Curated Items have been classified as.
   * This is a two-letter string, e.g. 'en' for English or 'de' for 'German'.
   */
  language?: Maybe<Scalars['String']>;
  /** Optional filter on the title field. Returns partial matches. */
  title?: Maybe<Scalars['String']>;
  /** Optional filter on the topic field. */
  topic?: Maybe<Scalars['String']>;
  /** Optional filter on the URL field. Returns partial matches. */
  url?: Maybe<Scalars['Url']>;
};

/** Input data for updating a Curated Item. */
export type UpdateCuratedItemInput = {
  /** The excerpt of the Curated Item. */
  excerpt: Scalars['String'];
  /** Curated Item ID. */
  externalId: Scalars['ID'];
  /** The image URL for this item's accompanying picture. */
  imageUrl: Scalars['Url'];
  /** Whether this story is a Pocket Collection. */
  isCollection: Scalars['Boolean'];
  /**
   * A flag to ML to not recommend this item long term after it is added to the corpus.
   * Example: a story covering an election.
   */
  isShortLived: Scalars['Boolean'];
  /** Whether this item is a syndicated article. */
  isSyndicated: Scalars['Boolean'];
  /** What language this item is in. This is a two-letter code, for example, 'en' for English. */
  language: Scalars['String'];
  /** The name of the online publication that published this story. */
  publisher: Scalars['String'];
  /** The outcome of the curators' review of the Curated Item. */
  status: CuratedStatus;
  /** The title of the Curated Item. */
  title: Scalars['String'];
  /**
   * A topic this story best fits in.
   * Temporarily a string value that will be provided by Prospect API, possibly an enum in the future.
   */
  topic: Scalars['String'];
  /** The URL of the Curated Item. */
  url: Scalars['Url'];
};

export type CuratedItemDataFragment = {
  __typename?: 'CuratedItem';
  externalId: string;
  title: string;
  language: string;
  publisher: string;
  url: any;
  imageUrl: any;
  excerpt: string;
  status: CuratedStatus;
  topic: string;
  isCollection: boolean;
  isShortLived: boolean;
  isSyndicated: boolean;
  createdBy: string;
  createdAt: number;
  updatedBy?: string | null | undefined;
  updatedAt: number;
};

export type RejectedCuratedCorpusItemDataFragment = {
  __typename?: 'RejectedCuratedCorpusItem';
  externalId: string;
  url: any;
  title: string;
  topic: string;
  language: string;
  publisher: string;
  reason: string;
  createdBy: string;
  createdAt: number;
};

export type GetCuratedItemsQueryVariables = Exact<{
  filters?: Maybe<CuratedItemFilter>;
  pagination?: Maybe<PaginationInput>;
}>;

export type GetCuratedItemsQuery = {
  __typename?: 'Query';
  getCuratedItems: {
    __typename?: 'CuratedItemConnection';
    totalCount: number;
    pageInfo: {
      __typename?: 'PageInfo';
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string | null | undefined;
      endCursor?: string | null | undefined;
    };
    edges: Array<{
      __typename?: 'CuratedItemEdge';
      cursor: string;
      node: {
        __typename?: 'CuratedItem';
        externalId: string;
        title: string;
        language: string;
        publisher: string;
        url: any;
        imageUrl: any;
        excerpt: string;
        status: CuratedStatus;
        topic: string;
        isCollection: boolean;
        isShortLived: boolean;
        isSyndicated: boolean;
        createdBy: string;
        createdAt: number;
        updatedBy?: string | null | undefined;
        updatedAt: number;
      };
    }>;
  };
};

export type GetRejectedCuratedCorpusItemsQueryVariables = Exact<{
  filters?: Maybe<RejectedCuratedCorpusItemFilter>;
  pagination?: Maybe<PaginationInput>;
}>;

export type GetRejectedCuratedCorpusItemsQuery = {
  __typename?: 'Query';
  getRejectedCuratedCorpusItems: {
    __typename?: 'RejectedCuratedCorpusItemConnection';
    totalCount: number;
    pageInfo: {
      __typename?: 'PageInfo';
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string | null | undefined;
      endCursor?: string | null | undefined;
    };
    edges: Array<{
      __typename?: 'RejectedCuratedCorpusItemEdge';
      cursor: string;
      node: {
        __typename?: 'RejectedCuratedCorpusItem';
        externalId: string;
        url: any;
        title: string;
        topic: string;
        language: string;
        publisher: string;
        reason: string;
        createdBy: string;
        createdAt: number;
      };
    }>;
  };
};

export const CuratedItemDataFragmentDoc = gql`
  fragment CuratedItemData on CuratedItem {
    externalId
    title
    language
    publisher
    url
    imageUrl
    excerpt
    status
    topic
    isCollection
    isShortLived
    isSyndicated
    createdBy
    createdAt
    updatedBy
    updatedAt
  }
`;
export const RejectedCuratedCorpusItemDataFragmentDoc = gql`
  fragment RejectedCuratedCorpusItemData on RejectedCuratedCorpusItem {
    externalId
    url
    title
    topic
    language
    publisher
    reason
    createdBy
    createdAt
  }
`;
export const GetCuratedItemsDocument = gql`
  query getCuratedItems(
    $filters: CuratedItemFilter
    $pagination: PaginationInput
  ) {
    getCuratedItems(filters: $filters, pagination: $pagination) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
          ...CuratedItemData
        }
      }
    }
  }
  ${CuratedItemDataFragmentDoc}
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
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
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
export const GetRejectedCuratedCorpusItemsDocument = gql`
  query getRejectedCuratedCorpusItems(
    $filters: RejectedCuratedCorpusItemFilter
    $pagination: PaginationInput
  ) {
    getRejectedCuratedCorpusItems(filters: $filters, pagination: $pagination) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
          ...RejectedCuratedCorpusItemData
        }
      }
    }
  }
  ${RejectedCuratedCorpusItemDataFragmentDoc}
`;

/**
 * __useGetRejectedCuratedCorpusItemsQuery__
 *
 * To run a query within a React component, call `useGetRejectedCuratedCorpusItemsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRejectedCuratedCorpusItemsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRejectedCuratedCorpusItemsQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useGetRejectedCuratedCorpusItemsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetRejectedCuratedCorpusItemsQuery,
    GetRejectedCuratedCorpusItemsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetRejectedCuratedCorpusItemsQuery,
    GetRejectedCuratedCorpusItemsQueryVariables
  >(GetRejectedCuratedCorpusItemsDocument, options);
}
export function useGetRejectedCuratedCorpusItemsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetRejectedCuratedCorpusItemsQuery,
    GetRejectedCuratedCorpusItemsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetRejectedCuratedCorpusItemsQuery,
    GetRejectedCuratedCorpusItemsQueryVariables
  >(GetRejectedCuratedCorpusItemsDocument, options);
}
export type GetRejectedCuratedCorpusItemsQueryHookResult = ReturnType<
  typeof useGetRejectedCuratedCorpusItemsQuery
>;
export type GetRejectedCuratedCorpusItemsLazyQueryHookResult = ReturnType<
  typeof useGetRejectedCuratedCorpusItemsLazyQuery
>;
export type GetRejectedCuratedCorpusItemsQueryResult = Apollo.QueryResult<
  GetRejectedCuratedCorpusItemsQuery,
  GetRejectedCuratedCorpusItemsQueryVariables
>;
