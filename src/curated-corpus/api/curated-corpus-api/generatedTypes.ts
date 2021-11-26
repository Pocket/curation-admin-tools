import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
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
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
  /** A URL - usually, for an interesting story on the internet that's worth saving to Pocket. */
  Url: any;
};

export type ApprovedCuratedCorpusImageUrl = {
  __typename?: 'ApprovedCuratedCorpusImageUrl';
  /** The url of the image stored in the s3 bucket */
  url: Scalars['String'];
};

/** A prospective story that has been reviewed by the curators and saved to the curated corpus. */
export type ApprovedCuratedCorpusItem = {
  __typename?: 'ApprovedCuratedCorpusItem';
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
  /** The GUID of the corresponding Prospect ID. */
  prospectId: Scalars['ID'];
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

/** The connection type for Approved Item. */
export type ApprovedCuratedCorpusItemConnection = {
  __typename?: 'ApprovedCuratedCorpusItemConnection';
  /** A list of edges. */
  edges: Array<ApprovedCuratedCorpusItemEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of Approved Items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type ApprovedCuratedCorpusItemEdge = {
  __typename?: 'ApprovedCuratedCorpusItemEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The Approved Item at the end of the edge. */
  node: ApprovedCuratedCorpusItem;
};

/** Available fields for filtering ApprovedCuratedCorpusItems. */
export type ApprovedCuratedCorpusItemFilter = {
  /**
   * Optional filter on the language Approved Items have been classified as.
   * This is a two-letter string, e.g. 'en' for English or 'de' for 'German'.
   */
  language?: InputMaybe<Scalars['String']>;
  /** Optional filter on the status of Approved Items. */
  status?: InputMaybe<CuratedStatus>;
  /** Optional filter on the title field. Returns partial matches. */
  title?: InputMaybe<Scalars['String']>;
  /** Optional filter on the topic field. */
  topic?: InputMaybe<Scalars['String']>;
  /** Optional filter on the URL field. Returns partial matches. */
  url?: InputMaybe<Scalars['Url']>;
};

/** Input data for creating an Approved Item and optionally scheduling this item to appear on New Tab. */
export type CreateApprovedCuratedCorpusItemInput = {
  /** The excerpt of the Approved Item. */
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
  /** Optionally, specify the GUID of the New Tab this item should be scheduled for. */
  newTabGuid?: InputMaybe<Scalars['ID']>;
  /** The GUID of the corresponding Prospect ID. */
  prospectId: Scalars['ID'];
  /** The name of the online publication that published this story. */
  publisher: Scalars['String'];
  /** Optionally, specify the date this item should be appearing on New Tab. Format: YYYY-MM-DD */
  scheduledDate?: InputMaybe<Scalars['Date']>;
  /** The outcome of the curators' review of the Approved Item. */
  status: CuratedStatus;
  /** The title of the Approved Item. */
  title: Scalars['String'];
  /**
   * A topic this story best fits in.
   * Temporarily a string value that will be provided by Prospect API, possibly an enum in the future.
   */
  topic: Scalars['String'];
  /** The URL of the Approved Item. */
  url: Scalars['Url'];
};

/** Input data for creating a scheduled entry for an Approved Item on a New Tab Feed. */
export type CreateScheduledCuratedCorpusItemInput = {
  /** The ID of the Approved Item that needs to be scheduled. */
  approvedItemExternalId: Scalars['ID'];
  /** The GUID of the New Tab Feed the Approved Item is going to appear on. Example: 'EN_US'. */
  newTabGuid: Scalars['ID'];
  /** The date the associated Approved Item is scheduled to appear on New Tab. Format: YYYY-MM-DD. */
  scheduledDate: Scalars['Date'];
};

/** The outcome of the curators reviewing a prospective story. */
export enum CuratedStatus {
  /** This story is suitable for our curated corpus. It's a second-tier recommendation. */
  Corpus = 'CORPUS',
  /** Recommend this story for Pocket users. This is first-tier content. */
  Recommendation = 'RECOMMENDATION',
}

/** Input data for deleting a scheduled item for a New Tab Feed. */
export type DeleteScheduledCuratedCorpusItemInput = {
  /** ID of the scheduled item. A string in UUID format. */
  externalId: Scalars['ID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Creates an Approved Item and optionally schedules it to appear on New Tab. */
  createApprovedCuratedCorpusItem: ApprovedCuratedCorpusItem;
  /** Creates a New Tab Scheduled Item. */
  createScheduledCuratedCorpusItem: ScheduledCuratedCorpusItem;
  /** Deletes an item from New Tab Schedule. */
  deleteScheduledCuratedCorpusItem: ScheduledCuratedCorpusItem;
  /** Updates an Approved Item. */
  updateApprovedCuratedCorpusItem: ApprovedCuratedCorpusItem;
  /** Uploads an image to S3 for an Approved Curated Corpus Item */
  uploadApprovedCuratedCorpusItemImage: ApprovedCuratedCorpusImageUrl;
};

export type MutationCreateApprovedCuratedCorpusItemArgs = {
  data: CreateApprovedCuratedCorpusItemInput;
};

export type MutationCreateScheduledCuratedCorpusItemArgs = {
  data: CreateScheduledCuratedCorpusItemInput;
};

export type MutationDeleteScheduledCuratedCorpusItemArgs = {
  data: DeleteScheduledCuratedCorpusItemInput;
};

export type MutationUpdateApprovedCuratedCorpusItemArgs = {
  data: UpdateApprovedCuratedCorpusItemInput;
};

export type MutationUploadApprovedCuratedCorpusItemImageArgs = {
  data: Scalars['Upload'];
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
  after?: InputMaybe<Scalars['String']>;
  /**
   * Returns the elements in the list that come before the specified cursor.
   * The specified cursor is not included in the result.
   */
  before?: InputMaybe<Scalars['String']>;
  /**
   * Returns the first _n_ elements from the list. Must be a non-negative integer.
   * If `first` contains a value, `last` should be null/omitted in the input.
   */
  first?: InputMaybe<Scalars['Int']>;
  /**
   * Returns the last _n_ elements from the list. Must be a non-negative integer.
   * If `last` contains a value, `first` should be null/omitted in the input.
   */
  last?: InputMaybe<Scalars['Int']>;
};

/**
 * Prospect types. This enum is not used anywhere in this schema, however it is used
 * by the Curation Admin Tools frontend to filter prospects.
 */
export enum ProspectType {
  Global = 'GLOBAL',
  OrganicTimespent = 'ORGANIC_TIMESPENT',
  Syndicated = 'SYNDICATED',
}

export type Query = {
  __typename?: 'Query';
  /** Retrieves a paginated, filterable list of ApprovedCuratedCorpusItems. */
  getApprovedCuratedCorpusItems: ApprovedCuratedCorpusItemConnection;
  /** Retrieves a paginated, filterable list of RejectedCuratedCorpusItems. */
  getRejectedCuratedCorpusItems: RejectedCuratedCorpusItemConnection;
  /** Retrieves a list of Approved Items that are scheduled to appear on New Tab */
  getScheduledCuratedCorpusItems: ScheduledCuratedCorpusItemsResult;
};

export type QueryGetApprovedCuratedCorpusItemsArgs = {
  filters?: InputMaybe<ApprovedCuratedCorpusItemFilter>;
  pagination?: InputMaybe<PaginationInput>;
};

export type QueryGetRejectedCuratedCorpusItemsArgs = {
  filters?: InputMaybe<RejectedCuratedCorpusItemFilter>;
  pagination?: InputMaybe<PaginationInput>;
};

export type QueryGetScheduledCuratedCorpusItemsArgs = {
  filters: ScheduledCuratedCorpusItemsFilterInput;
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
  /** The GUID of the corresponding Prospect ID. */
  prospectId: Scalars['ID'];
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
  language?: InputMaybe<Scalars['String']>;
  /** Optional filter on the title field. Returns partial matches. */
  title?: InputMaybe<Scalars['String']>;
  /** Optional filter on the topic field. */
  topic?: InputMaybe<Scalars['String']>;
  /** Optional filter on the URL field. Returns partial matches. */
  url?: InputMaybe<Scalars['Url']>;
};

/**
 * Possible reasons for rejecting a prospect. This enum is not used anywhere in this schema,
 * however it is used by the Curation Admin Tools frontend to specify rejection reasons.
 */
export enum RejectionReason {
  Misinformation = 'MISINFORMATION',
  OffensiveMaterial = 'OFFENSIVE_MATERIAL',
  Other = 'OTHER',
  Paywall = 'PAYWALL',
  PoliticalOpinion = 'POLITICAL_OPINION',
  TimeSensitive = 'TIME_SENSITIVE',
}

/**
 * A scheduled entry for an Approved Item to appear on a New Tab Feed.
 * For example, a story that is scheduled to appear on December 31st, 2021 on the New Tab in Firefox for the US audience.
 */
export type ScheduledCuratedCorpusItem = {
  __typename?: 'ScheduledCuratedCorpusItem';
  /** The associated Approved Item. */
  approvedItem: ApprovedCuratedCorpusItem;
  /** A Unix timestamp of when the entity was created. */
  createdAt: Scalars['Int'];
  /** A single sign-on user identifier of the user who created this entity. */
  createdBy: Scalars['String'];
  /** An alternative primary key in UUID format that is generated on creation. */
  externalId: Scalars['ID'];
  /**
   * The date the associated Approved Item is scheduled to appear on New Tab.
   * This date is relative to the time zone of the New Tab. Format: YYYY-MM-DD.
   */
  scheduledDate: Scalars['Date'];
  /** A Unix timestamp of when the entity was last updated. */
  updatedAt: Scalars['Int'];
  /** A single sign-on user identifier of the user who last updated this entity. Null on creation. */
  updatedBy?: Maybe<Scalars['String']>;
};

/** Available fields for filtering scheduled items for a given New Tab. */
export type ScheduledCuratedCorpusItemsFilterInput = {
  /** To what day to show scheduled items to, inclusive. Expects a date in YYYY-MM-DD format. */
  endDate: Scalars['Date'];
  /** The GUID of the New Tab. Example: 'EN_US'. */
  newTabGuid: Scalars['ID'];
  /** Which day to show scheduled items from. Expects a date in YYYY-MM-DD format. */
  startDate: Scalars['Date'];
};

/** The shape of the result returned by the getScheduledCuratedCorpusItems query. */
export type ScheduledCuratedCorpusItemsResult = {
  __typename?: 'ScheduledCuratedCorpusItemsResult';
  /** An array of items for a given New Tab Feed */
  items: Array<ScheduledCuratedCorpusItem>;
};

/**
 * The list of Pocket topics. This enum is not used anywhere in this schema, however it is used
 * by the Curation Admin Tools frontend to edit curated items.
 */
export enum Topics {
  Business = 'BUSINESS',
  Career = 'CAREER',
  Coronavirus = 'CORONAVIRUS',
  Education = 'EDUCATION',
  Entertainment = 'ENTERTAINMENT',
  Food = 'FOOD',
  Gaming = 'GAMING',
  HealthFitness = 'HEALTH_FITNESS',
  Parenting = 'PARENTING',
  PersonalFinance = 'PERSONAL_FINANCE',
  Politics = 'POLITICS',
  Science = 'SCIENCE',
  SelfImprovement = 'SELF_IMPROVEMENT',
  Sports = 'SPORTS',
  Technology = 'TECHNOLOGY',
  Travel = 'TRAVEL',
}

/** Input data for updating an Approved Item. */
export type UpdateApprovedCuratedCorpusItemInput = {
  /** The excerpt of the Approved Item. */
  excerpt: Scalars['String'];
  /** Approved Item ID. */
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
  /** The GUID of the corresponding Prospect ID. */
  prospectId: Scalars['ID'];
  /** The name of the online publication that published this story. */
  publisher: Scalars['String'];
  /** The outcome of the curators' review of the Approved Item. */
  status: CuratedStatus;
  /** The title of the Approved Item. */
  title: Scalars['String'];
  /**
   * A topic this story best fits in.
   * Temporarily a string value that will be provided by Prospect API, possibly an enum in the future.
   */
  topic: Scalars['String'];
  /** The URL of the Approved Item. */
  url: Scalars['Url'];
};

export type CuratedItemDataFragment = {
  __typename?: 'ApprovedCuratedCorpusItem';
  externalId: string;
  prospectId: string;
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

export type RejectedItemDataFragment = {
  __typename?: 'RejectedCuratedCorpusItem';
  externalId: string;
  prospectId: string;
  url: any;
  title: string;
  topic: string;
  language: string;
  publisher: string;
  reason: string;
  createdBy: string;
  createdAt: number;
};

export type CreateNewTabFeedScheduledItemMutationVariables = Exact<{
  approvedItemExternalId: Scalars['ID'];
  newTabGuid: Scalars['ID'];
  scheduledDate: Scalars['Date'];
}>;

export type CreateNewTabFeedScheduledItemMutation = {
  __typename?: 'Mutation';
  createScheduledCuratedCorpusItem: {
    __typename?: 'ScheduledCuratedCorpusItem';
    externalId: string;
    createdAt: number;
    createdBy: string;
    updatedAt: number;
    updatedBy?: string | null | undefined;
    scheduledDate: any;
    approvedItem: {
      __typename?: 'ApprovedCuratedCorpusItem';
      externalId: string;
      prospectId: string;
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
  };
};

export type UploadApprovedCuratedCorpusItemImageMutationVariables = Exact<{
  image: Scalars['Upload'];
}>;

export type UploadApprovedCuratedCorpusItemImageMutation = {
  __typename?: 'Mutation';
  uploadApprovedCuratedCorpusItemImage: {
    __typename?: 'ApprovedCuratedCorpusImageUrl';
    url: string;
  };
};

export type GetApprovedItemsQueryVariables = Exact<{
  filters?: InputMaybe<ApprovedCuratedCorpusItemFilter>;
  pagination?: InputMaybe<PaginationInput>;
}>;

export type GetApprovedItemsQuery = {
  __typename?: 'Query';
  getApprovedCuratedCorpusItems: {
    __typename?: 'ApprovedCuratedCorpusItemConnection';
    totalCount: number;
    pageInfo: {
      __typename?: 'PageInfo';
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string | null | undefined;
      endCursor?: string | null | undefined;
    };
    edges: Array<{
      __typename?: 'ApprovedCuratedCorpusItemEdge';
      cursor: string;
      node: {
        __typename?: 'ApprovedCuratedCorpusItem';
        externalId: string;
        prospectId: string;
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

export type GetRejectedItemsQueryVariables = Exact<{
  filters?: InputMaybe<RejectedCuratedCorpusItemFilter>;
  pagination?: InputMaybe<PaginationInput>;
}>;

export type GetRejectedItemsQuery = {
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
        prospectId: string;
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
  fragment CuratedItemData on ApprovedCuratedCorpusItem {
    externalId
    prospectId
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
export const RejectedItemDataFragmentDoc = gql`
  fragment RejectedItemData on RejectedCuratedCorpusItem {
    externalId
    prospectId
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
export const CreateNewTabFeedScheduledItemDocument = gql`
  mutation createNewTabFeedScheduledItem(
    $approvedItemExternalId: ID!
    $newTabGuid: ID!
    $scheduledDate: Date!
  ) {
    createScheduledCuratedCorpusItem(
      data: {
        approvedItemExternalId: $approvedItemExternalId
        newTabGuid: $newTabGuid
        scheduledDate: $scheduledDate
      }
    ) {
      externalId
      createdAt
      createdBy
      updatedAt
      updatedBy
      scheduledDate
      approvedItem {
        ...CuratedItemData
      }
    }
  }
  ${CuratedItemDataFragmentDoc}
`;
export type CreateNewTabFeedScheduledItemMutationFn = Apollo.MutationFunction<
  CreateNewTabFeedScheduledItemMutation,
  CreateNewTabFeedScheduledItemMutationVariables
>;

/**
 * __useCreateNewTabFeedScheduledItemMutation__
 *
 * To run a mutation, you first call `useCreateNewTabFeedScheduledItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateNewTabFeedScheduledItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createNewTabFeedScheduledItemMutation, { data, loading, error }] = useCreateNewTabFeedScheduledItemMutation({
 *   variables: {
 *      approvedItemExternalId: // value for 'approvedItemExternalId'
 *      newTabGuid: // value for 'newTabGuid'
 *      scheduledDate: // value for 'scheduledDate'
 *   },
 * });
 */
export function useCreateNewTabFeedScheduledItemMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateNewTabFeedScheduledItemMutation,
    CreateNewTabFeedScheduledItemMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateNewTabFeedScheduledItemMutation,
    CreateNewTabFeedScheduledItemMutationVariables
  >(CreateNewTabFeedScheduledItemDocument, options);
}
export type CreateNewTabFeedScheduledItemMutationHookResult = ReturnType<
  typeof useCreateNewTabFeedScheduledItemMutation
>;
export type CreateNewTabFeedScheduledItemMutationResult =
  Apollo.MutationResult<CreateNewTabFeedScheduledItemMutation>;
export type CreateNewTabFeedScheduledItemMutationOptions =
  Apollo.BaseMutationOptions<
    CreateNewTabFeedScheduledItemMutation,
    CreateNewTabFeedScheduledItemMutationVariables
  >;
export const UploadApprovedCuratedCorpusItemImageDocument = gql`
  mutation uploadApprovedCuratedCorpusItemImage($image: Upload!) {
    uploadApprovedCuratedCorpusItemImage(data: $image) {
      url
    }
  }
`;
export type UploadApprovedCuratedCorpusItemImageMutationFn =
  Apollo.MutationFunction<
    UploadApprovedCuratedCorpusItemImageMutation,
    UploadApprovedCuratedCorpusItemImageMutationVariables
  >;

/**
 * __useUploadApprovedCuratedCorpusItemImageMutation__
 *
 * To run a mutation, you first call `useUploadApprovedCuratedCorpusItemImageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadApprovedCuratedCorpusItemImageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadApprovedCuratedCorpusItemImageMutation, { data, loading, error }] = useUploadApprovedCuratedCorpusItemImageMutation({
 *   variables: {
 *      image: // value for 'image'
 *   },
 * });
 */
export function useUploadApprovedCuratedCorpusItemImageMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UploadApprovedCuratedCorpusItemImageMutation,
    UploadApprovedCuratedCorpusItemImageMutationVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UploadApprovedCuratedCorpusItemImageMutation,
    UploadApprovedCuratedCorpusItemImageMutationVariables
  >(UploadApprovedCuratedCorpusItemImageDocument, options);
}
export type UploadApprovedCuratedCorpusItemImageMutationHookResult = ReturnType<
  typeof useUploadApprovedCuratedCorpusItemImageMutation
>;
export type UploadApprovedCuratedCorpusItemImageMutationResult =
  Apollo.MutationResult<UploadApprovedCuratedCorpusItemImageMutation>;
export type UploadApprovedCuratedCorpusItemImageMutationOptions =
  Apollo.BaseMutationOptions<
    UploadApprovedCuratedCorpusItemImageMutation,
    UploadApprovedCuratedCorpusItemImageMutationVariables
  >;
export const GetApprovedItemsDocument = gql`
  query getApprovedItems(
    $filters: ApprovedCuratedCorpusItemFilter
    $pagination: PaginationInput
  ) {
    getApprovedCuratedCorpusItems(filters: $filters, pagination: $pagination) {
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
 * __useGetApprovedItemsQuery__
 *
 * To run a query within a React component, call `useGetApprovedItemsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetApprovedItemsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetApprovedItemsQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useGetApprovedItemsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetApprovedItemsQuery,
    GetApprovedItemsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetApprovedItemsQuery, GetApprovedItemsQueryVariables>(
    GetApprovedItemsDocument,
    options
  );
}
export function useGetApprovedItemsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetApprovedItemsQuery,
    GetApprovedItemsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetApprovedItemsQuery,
    GetApprovedItemsQueryVariables
  >(GetApprovedItemsDocument, options);
}
export type GetApprovedItemsQueryHookResult = ReturnType<
  typeof useGetApprovedItemsQuery
>;
export type GetApprovedItemsLazyQueryHookResult = ReturnType<
  typeof useGetApprovedItemsLazyQuery
>;
export type GetApprovedItemsQueryResult = Apollo.QueryResult<
  GetApprovedItemsQuery,
  GetApprovedItemsQueryVariables
>;
export const GetRejectedItemsDocument = gql`
  query getRejectedItems(
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
          ...RejectedItemData
        }
      }
    }
  }
  ${RejectedItemDataFragmentDoc}
`;

/**
 * __useGetRejectedItemsQuery__
 *
 * To run a query within a React component, call `useGetRejectedItemsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRejectedItemsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRejectedItemsQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      pagination: // value for 'pagination'
 *   },
 * });
 */
export function useGetRejectedItemsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetRejectedItemsQuery,
    GetRejectedItemsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetRejectedItemsQuery, GetRejectedItemsQueryVariables>(
    GetRejectedItemsDocument,
    options
  );
}
export function useGetRejectedItemsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetRejectedItemsQuery,
    GetRejectedItemsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetRejectedItemsQuery,
    GetRejectedItemsQueryVariables
  >(GetRejectedItemsDocument, options);
}
export type GetRejectedItemsQueryHookResult = ReturnType<
  typeof useGetRejectedItemsQuery
>;
export type GetRejectedItemsLazyQueryHookResult = ReturnType<
  typeof useGetRejectedItemsLazyQuery
>;
export type GetRejectedItemsQueryResult = Apollo.QueryResult<
  GetRejectedItemsQuery,
  GetRejectedItemsQueryVariables
>;
