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
  /** A String representing a date in the format of `yyyy-MM-dd HH:mm:ss` */
  DateString: any;
  Markdown: any;
  /** A String in the format of a url. */
  Url: any;
};

/** Information about an Author of an article or some content */
export type Author = {
  __typename?: 'Author';
  /** Unique id for that Author */
  id: Scalars['ID'];
  /** Display name */
  name?: Maybe<Scalars['String']>;
  /** A url to that Author's site */
  url?: Maybe<Scalars['String']>;
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
};

export type CollectionsResult = {
  __typename?: 'CollectionsResult';
  pagination: Pagination;
  collections: Array<Collection>;
};

/** This type represents the information we need on a curated item. */
export type CuratedInfo = {
  __typename?: 'CuratedInfo';
  title?: Maybe<Scalars['String']>;
  excerpt?: Maybe<Scalars['String']>;
  imageSrc?: Maybe<Scalars['Url']>;
};

/** Metadata from a domain, originally populated from ClearBit */
export type DomainMetadata = {
  __typename?: 'DomainMetadata';
  /** The name of the domain (e.g., The New York Times) */
  name?: Maybe<Scalars['String']>;
  /** Url for the logo image */
  logo?: Maybe<Scalars['Url']>;
  /** Url for the greyscale logo image */
  logoGreyscale?: Maybe<Scalars['Url']>;
};

/** An image, typically a thumbnail or article view image for an {Item} */
export type Image = {
  __typename?: 'Image';
  /** A caption or description of the image */
  caption?: Maybe<Scalars['String']>;
  /** A credit for the image, typically who the image belongs to / created by */
  credit?: Maybe<Scalars['String']>;
  /** If known, the height of the image in px */
  height?: Maybe<Scalars['Int']>;
  /** The id for placing within an Article View. {articleView.article} will have placeholders of <div id='RIL_IMG_X' /> where X is this id. Apps can download those images as needed and populate them in their article view. */
  imageId?: Maybe<Scalars['Int']>;
  /** Absolute url to the image */
  src?: Maybe<Scalars['String']>;
  /** If known, the width of the image in px */
  width?: Maybe<Scalars['Int']>;
};

export enum Imageness {
  /** No images (v3 value is 0) */
  NoImages = 'NO_IMAGES',
  /** Contains images (v3 value is 1) */
  HasImages = 'HAS_IMAGES',
  /** Is an image (v3 value is 2) */
  IsImage = 'IS_IMAGE',
}

/**
 * The heart of Pocket
 * A url and meta data related to it.
 */
export type Item = {
  __typename?: 'Item';
  /** A server generated unique id for this item. Item's whose {.normalUrl} are the same will have the same item_id. Most likely numeric, but to ensure future proofing this can be treated as a String in apps. */
  itemId: Scalars['String'];
  /**
   * A normalized value of the givenUrl.
   * It will look like a url but is not guaranteed to be a valid url, just a unique string that is used to eliminate common duplicates.
   * Item's that share a normal_url should be considered the same item. For example https://getpocket.com and http://getpocket.com will be considered the same since they both normalize to http://getpocket.com
   * This is technically the true identity of an item, since this is what the backend uses to tell if two items are the same.
   * However, for the clients to use this, they would all have to ship an implementation of the normalization function that the backend has exactly.
   * And even if it did that, some items, some of the earliest saves, use a legacy normalize function and the client would have no way to know when to use which normalizing function.
   */
  normalUrl: Scalars['String'];
  /** If available, the url to an AMP version of this article */
  ampUrl?: Maybe<Scalars['Url']>;
  /** List of Authors involved with this article */
  authors?: Maybe<Array<Maybe<Author>>>;
  /** The domain, such as 'getpocket.com' of the {.resolved_url} */
  domain?: Maybe<Scalars['String']>;
  /** Additional information about the item domain, when present, use this for displaying the domain name */
  domainMetadata?: Maybe<DomainMetadata>;
  /** The string encoding code of this item's web page */
  encoding?: Maybe<Scalars['String']>;
  /** A snippet of text from the article */
  excerpt?: Maybe<Scalars['String']>;
  /** 0=no images, 1=contains images, 2=is an image */
  hasImage?: Maybe<Imageness>;
  /** 0=no videos, 1=contains video, 2=is a video */
  hasVideo?: Maybe<Videoness>;
  /** Array of images within an article */
  images?: Maybe<Array<Maybe<Image>>>;
  /** true if the item is an article */
  isArticle?: Maybe<Scalars['Boolean']>;
  /** true if the item is an index / home page, rather than a specific single piece of content */
  isIndex?: Maybe<Scalars['Boolean']>;
  /** The mime type of this item's web page */
  mimeType?: Maybe<Scalars['String']>;
  /** The item id of the resolved_url */
  resolvedId?: Maybe<Scalars['String']>;
  /** If the givenUrl redirects (once or many times), this is the final url. Otherwise, same as givenUrl */
  resolvedUrl?: Maybe<Scalars['Url']>;
  /** The title as determined by the parser. */
  title?: Maybe<Scalars['String']>;
  /** The page's / publisher's preferred thumbnail image */
  topImageUrl?: Maybe<Scalars['Url']>;
  /** Array of videos within the item If the item is a video, this will likely just contain one video */
  videos?: Maybe<Array<Maybe<Video>>>;
  /** Number of words in the article */
  wordCount?: Maybe<Scalars['Int']>;
  /** The date the parser resolved this item */
  dateResolved?: Maybe<Scalars['DateString']>;
  /** The date the article was published */
  datePublished?: Maybe<Scalars['DateString']>;
  /** The detected language of the article */
  language?: Maybe<Scalars['String']>;
  /** How long it will take to read the article (TODO in what time unit? and by what calculation?) */
  timeToRead?: Maybe<Scalars['Int']>;
  /** The url as provided by the user when saving. Only http or https schemes allowed. */
  givenUrl: Scalars['Url'];
  /**
   * Indicates that the item was stored via a different search_hash (using the old method), we'll need to look up a different id
   * @deprecated Most new items use a new hash
   */
  hasOldDupes?: Maybe<Scalars['Boolean']>;
  /**
   * The primary database id of the domain this article is from
   * @deprecated Use a domain as the identifier instead
   */
  domainId?: Maybe<Scalars['String']>;
  /**
   * If a the domainId is a subdomain this is the primary domain id
   * @deprecated Use a domain as the identifier instead
   */
  originDomainId?: Maybe<Scalars['String']>;
  /**
   * The http resonse code of the given url
   * @deprecated Clients should not use this
   */
  responseCode?: Maybe<Scalars['Int']>;
  /**
   * The length in bytes of the content
   * @deprecated Clients should not use this
   */
  contentLength?: Maybe<Scalars['Int']>;
  /**
   * Indicates if the text of the url is a redirect to another url
   * @deprecated Clients should not use this
   */
  innerDomainRedirect?: Maybe<Scalars['Boolean']>;
  /**
   * Indicates if the url requires a login
   * @deprecated Clients should not use this
   */
  loginRequired?: Maybe<Scalars['Boolean']>;
  /**
   * Indicates if the parser used fallback methods
   * @deprecated Clients should not use this
   */
  usedFallback?: Maybe<Scalars['Int']>;
  /**
   * Date this item was first parsed in Pocket
   * @deprecated Clients should not use this
   */
  timeFirstParsed?: Maybe<Scalars['DateString']>;
  /**
   * The resolved url, but ran through the normalized function
   * @deprecated Use the resolved url instead
   */
  resolvedNormalUrl?: Maybe<Scalars['Url']>;
  /** If the item is a collection allow them to get the collection information */
  collection?: Maybe<Collection>;
  /** If the item has a syndicated counterpart the syndication information */
  syndicatedArticle?: Maybe<SyndicatedArticle>;
};

/**
 * Represents a type of page for /explore
 * Deprecated for SlateLineups
 */
export enum PageType {
  EditorialCollection = 'editorial_collection',
  TopicPage = 'topic_page',
}

export type Pagination = {
  __typename?: 'Pagination';
  currentPage: Scalars['Int'];
  totalPages: Scalars['Int'];
  totalResults: Scalars['Int'];
  perPage: Scalars['Int'];
};

/** The publisher that the curation team set for the syndicated article */
export type Publisher = {
  __typename?: 'Publisher';
  /** Name of the publisher of the article */
  name?: Maybe<Scalars['String']>;
  /** Url of the publisher */
  url?: Maybe<Scalars['Url']>;
  /** Logo to use for the publisher */
  logo?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  /** Retrievs a paged set of published Collections. */
  getCollections: CollectionsResult;
  /** Retrieves a Collection by the given slug. The Collection must be published. */
  getCollectionBySlug?: Maybe<Collection>;
  /**
   * Get the recomendations for a specific topic
   * @deprecated Use `getSlateLineup` with a specific SlateLineup instead.
   */
  getTopicRecommendations?: Maybe<TopicRecommendations>;
  /**
   * List all available topics that we have recomendarions for.
   * @deprecated Use `getSlateLineup` with a specific SlateLineup instead.
   */
  listTopics: Array<Topic>;
  /** Request a specific `Slate` by id */
  getSlate?: Maybe<Slate>;
  /** List all available slates */
  listSlates: Array<Slate>;
  /** Request a specific `SlateLineup` by id */
  getSlateLineup?: Maybe<SlateLineup>;
  /**
   * Returns a list of unleash toggles that are enabled for a given context.
   *
   * For more details on this check out https://docs.google.com/document/d/1dYS81h-DbQEWNLtK-ajLTylw454S32llPXUyBmDd5mU/edit# and https://getpocket.atlassian.net/wiki/spaces/PE/pages/1191444582/Feature+Flags+-+Unleash
   *
   * ~ For each of the enabled unleash toggles (via https://featureflags.readitlater.com/api/client/features or an unleash sdk)
   * ~ Check if the toggle is assigned/enabled for the provided {.context}
   * ~ Add an {UnleashAssignment} representing it to this list
   * ~ If no toggles are found, return an empty list
   */
  getUnleashAssignments?: Maybe<UnleashAssignmentList>;
  /**
   * Gets an item by a url
   * This could return null if the legacy parser service hasn't seen the item yet
   */
  getItemByUrl?: Maybe<Item>;
  /**
   * Gets an item by an item ID
   * This could return null if the legacy parser service hasn't seen the item yet
   */
  getItemByItemId?: Maybe<Item>;
};

export type QueryGetCollectionsArgs = {
  page?: Maybe<Scalars['Int']>;
  perPage?: Maybe<Scalars['Int']>;
};

export type QueryGetCollectionBySlugArgs = {
  slug: Scalars['String'];
};

export type QueryGetTopicRecommendationsArgs = {
  slug: Scalars['String'];
  algorithmicCount?: Maybe<Scalars['Int']>;
  curatedCount?: Maybe<Scalars['Int']>;
};

export type QueryGetSlateArgs = {
  slateId: Scalars['String'];
  recommendationCount?: Maybe<Scalars['Int']>;
};

export type QueryListSlatesArgs = {
  recommendationCount?: Maybe<Scalars['Int']>;
};

export type QueryGetSlateLineupArgs = {
  slateLineupId: Scalars['String'];
  slateCount?: Maybe<Scalars['Int']>;
  recommendationCount?: Maybe<Scalars['Int']>;
};

export type QueryGetUnleashAssignmentsArgs = {
  context: UnleashContext;
};

export type QueryGetItemByUrlArgs = {
  url: Scalars['String'];
};

export type QueryGetItemByItemIdArgs = {
  id: Scalars['ID'];
};

/** Represents a Recomendation from Pocket */
export type Recommendation = {
  __typename?: 'Recommendation';
  /** A generated id from the Data and Learning team that represents the Recomendation */
  id?: Maybe<Scalars['ID']>;
  /**
   * A generated id from the Data and Learning team that represents the Recomendation - Deprecated
   * @deprecated Use `id`
   */
  feedItemId?: Maybe<Scalars['ID']>;
  /**
   * The ID of the item this recomendation represents
   * TODO: Use apollo federation to turn this into an Item type.
   */
  itemId: Scalars['ID'];
  /** The Item that is resolved by apollo federation using the itemId */
  item: Item;
  /** The feed id from mysql that this item was curated from (if it was curated) */
  feedId?: Maybe<Scalars['Int']>;
  /** The publisher of the item */
  publisher?: Maybe<Scalars['String']>;
  /** The source of the recommendation */
  recSrc: Scalars['String'];
  curatedInfo?: Maybe<CuratedInfo>;
};

/** A grouping of item recomendations that relate to each other under a specific name and description */
export type Slate = {
  __typename?: 'Slate';
  id: Scalars['String'];
  /**
   * A guid that is unique to every API request that returned slates, such as `getSlateLineup` or `getSlate`.
   * The API will provide a new request id every time apps hit the API.
   */
  requestId: Scalars['ID'];
  /**
   * A unique guid/slug, provided by the Data & Learning team that can identify a specific experiment.
   * Production apps typically won't request a specific one, but can for QA or during a/b testing.
   */
  experimentId: Scalars['ID'];
  /** The name to show to the user for this set of recomendations */
  displayName?: Maybe<Scalars['String']>;
  /** The description of the the slate */
  description?: Maybe<Scalars['String']>;
  /** An ordered list of the recomendations to show to the user */
  recommendations: Array<Recommendation>;
};

export type SlateLineup = {
  __typename?: 'SlateLineup';
  /** A unique slug/id that describes a SlateLineup. The Data & Learning team will provide apps what id to use here for specific cases. */
  id: Scalars['ID'];
  /**
   * A guid that is unique to every API request that returned slates, such as `getRecommendationSlateLineup` or `getSlate`.
   * The API will provide a new request id every time apps hit the API.
   */
  requestId: Scalars['ID'];
  /**
   * A unique guid/slug, provided by the Data & Learning team that can identify a specific experiment.
   * Production apps typically won't request a specific one, but can for QA or during a/b testing.
   */
  experimentId: Scalars['ID'];
  /** An ordered list of slates for the client to display */
  slates: Array<Slate>;
};

/** An article that Pocket has syndicated and we also host on our own site */
export type SyndicatedArticle = {
  __typename?: 'SyndicatedArticle';
  /** Slug that pocket uses for this article in the url */
  slug?: Maybe<Scalars['String']>;
  /** The manually set publisher information for this article */
  publisher?: Maybe<Publisher>;
};

/**
 * Represents a topic for /explore
 * Deprecated for SlateLineups
 */
export type Topic = {
  __typename?: 'Topic';
  /** The id of the topic */
  id: Scalars['ID'];
  /** The name of the topic to show to the user */
  displayName: Scalars['String'];
  /** If returned a note to show to the user about the topic */
  displayNote?: Maybe<Scalars['String']>;
  /** The slug that should be used in the url to represent the topic */
  slug: Scalars['String'];
  /** The query that was used internally for elasticsearch to find items */
  query: Array<Scalars['String']>;
  /** The label the curator uses internally to get items onto this topic */
  curatorLabel: Scalars['String'];
  /** Whether or not clients should show this topic ot users */
  isDisplayed: Scalars['Boolean'];
  /** Whether or not this topic should be visiblly promoted (prominent on the page) */
  isPromoted: Scalars['Boolean'];
  /** The title to use in the HTML markup for SEO and social media sharing */
  socialTitle?: Maybe<Scalars['String']>;
  /** The description to use in the HTML markup for SEO and social media sharing */
  socialDescription?: Maybe<Scalars['String']>;
  /** The image to use in the HTML markup for SEO and social media sharing */
  socialImage?: Maybe<Scalars['String']>;
  /** The type of page this topic represents used in  generation */
  pageType: PageType;
  /** The internal feed id that this topic will pull from if set */
  customFeedId?: Maybe<Scalars['ID']>;
};

/**
 * Represents a set of recomednations for /explore
 * Deprecated for SlateLineups
 */
export type TopicRecommendations = {
  __typename?: 'TopicRecommendations';
  /** Recomendations that are sourced directly from our curators */
  curatedRecommendations: Array<Recommendation>;
  /** Recomendations that are sourced from Machine Learning models */
  algorithmicRecommendations: Array<Recommendation>;
};

/** Details on the variant/status of this toggle for a given user/context */
export type UnleashAssignment = {
  __typename?: 'UnleashAssignment';
  /** The unleash toggle name, the same name as it appears in the admin interface and feature api */
  name: Scalars['String'];
  /** Whether or not the provided context is assigned */
  assigned: Scalars['Boolean'];
  /** If the toggle has variants, the variant name it is assigned to */
  variant?: Maybe<Scalars['String']>;
  /** If the variant has a payload, its payload value */
  payload?: Maybe<Scalars['String']>;
};

/** Contains a list of all toggles. */
export type UnleashAssignmentList = {
  __typename?: 'UnleashAssignmentList';
  assignments: Array<Maybe<UnleashAssignment>>;
};

/**
 * Information about the user and device. Based on https://unleash.github.io/docs/unleash_context
 *
 * Used to calculate assignment values.
 */
export type UnleashContext = {
  /**
   * A unique name for one of our apps. Can be any string, but here are some known/expected values:
   *
   * - `android`
   * - `ios`
   * - `web-discover`
   * - `web-app`
   */
  appName?: Maybe<Scalars['String']>;
  environment?: Maybe<UnleashEnvironment>;
  /** If logged in, the user's encoded user id (uid). The {Account.user_id}. */
  userId?: Maybe<Scalars['String']>;
  /** A device specific identifier that will be consistent across sessions, typically the encoded {guid} or some session token. */
  sessionId: Scalars['String'];
  /** The device's IP address. If omitted, inferred from either request header `x-forwarded-for` or the origin IP of the request. */
  remoteAddress?: Maybe<Scalars['String']>;
  properties?: Maybe<UnleashProperties>;
};

export enum UnleashEnvironment {
  /** User facing, production builds */
  Prod = 'prod',
  /** User facing, beta level builds */
  Beta = 'beta',
  /** Internal team builds */
  Alpha = 'alpha',
}

/** Extended properties that Unleash can use to assign users through a toggle's strategies. */
export type UnleashProperties = {
  /** If omitted, inferred from request header `accept-langauge`. */
  locale?: Maybe<Scalars['String']>;
  /** Only required on activation strategies that are based on account age */
  accountCreatedAt?: Maybe<Scalars['String']>;
};

/** A Video, typically within an Article View of an {Item} or if the Item is a video itself." */
export type Video = {
  __typename?: 'Video';
  /** If known, the height of the video in px */
  height?: Maybe<Scalars['Int']>;
  /** Absolute url to the video */
  src: Scalars['String'];
  /** The type of video */
  type: VideoType;
  /** The video's id within the service defined by type */
  vid?: Maybe<Scalars['String']>;
  /** The id of the video within Article View. {articleView.article} will have placeholders of <div id='RIL_VID_X' /> where X is this id. Apps can download those images as needed and populate them in their article view. */
  videoId: Scalars['Int'];
  /** If known, the width of the video in px */
  width?: Maybe<Scalars['Int']>;
  /** If known, the length of the video in seconds */
  length?: Maybe<Scalars['Int']>;
};

export enum VideoType {
  /** Youtube (v3 value is 1) */
  Youtube = 'YOUTUBE',
  /** Vimeo Link (v3 value is 2) */
  VimeoLink = 'VIMEO_LINK',
  /** Vimeo Moogaloop (v3 value is 3) */
  VimeoMoogaloop = 'VIMEO_MOOGALOOP',
  /** video iframe (v3 value is 4) */
  VimeoIframe = 'VIMEO_IFRAME',
  /** html5 (v3 value is 5) */
  Html5 = 'HTML5',
  /** Flash (v3 value is 6) */
  Flash = 'FLASH',
  /** iframe (v3 value is 7) */
  Iframe = 'IFRAME',
  /** Brightcove (v3 value is 8) */
  Brightcove = 'BRIGHTCOVE',
}

export enum Videoness {
  /** No videos (v3 value is 0) */
  NoVideos = 'NO_VIDEOS',
  /** Contains videos (v3 value is 1) */
  HasVideos = 'HAS_VIDEOS',
  /** Is a video (v3 value is 2) */
  IsVideo = 'IS_VIDEO',
}

export type GetStoryFromParserQueryVariables = Exact<{
  getItemByUrlUrl: Scalars['String'];
}>;

export type GetStoryFromParserQuery = { __typename?: 'Query' } & {
  getItemByUrl?: Maybe<
    { __typename?: 'Item' } & Pick<
      Item,
      'resolvedUrl' | 'title' | 'excerpt' | 'topImageUrl'
    > & {
        authors?: Maybe<
          Array<Maybe<{ __typename?: 'Author' } & Pick<Author, 'name'>>>
        >;
        domainMetadata?: Maybe<
          { __typename?: 'DomainMetadata' } & Pick<DomainMetadata, 'name'>
        >;
      }
  >;
};

export const GetStoryFromParserDocument = gql`
  query getStoryFromParser($getItemByUrlUrl: String!) {
    getItemByUrl(url: $getItemByUrlUrl) {
      resolvedUrl
      title
      excerpt
      topImageUrl
      authors {
        name
      }
      domainMetadata {
        name
      }
    }
  }
`;

/**
 * __useGetStoryFromParserQuery__
 *
 * To run a query within a React component, call `useGetStoryFromParserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStoryFromParserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStoryFromParserQuery({
 *   variables: {
 *      getItemByUrlUrl: // value for 'getItemByUrlUrl'
 *   },
 * });
 */
export function useGetStoryFromParserQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetStoryFromParserQuery,
    GetStoryFromParserQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetStoryFromParserQuery,
    GetStoryFromParserQueryVariables
  >(GetStoryFromParserDocument, options);
}
export function useGetStoryFromParserLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetStoryFromParserQuery,
    GetStoryFromParserQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetStoryFromParserQuery,
    GetStoryFromParserQueryVariables
  >(GetStoryFromParserDocument, options);
}
export type GetStoryFromParserQueryHookResult = ReturnType<
  typeof useGetStoryFromParserQuery
>;
export type GetStoryFromParserLazyQueryHookResult = ReturnType<
  typeof useGetStoryFromParserLazyQuery
>;
export type GetStoryFromParserQueryResult = Apollo.QueryResult<
  GetStoryFromParserQuery,
  GetStoryFromParserQueryVariables
>;
