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
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date string, such as 2007-12-03, compliant with the `full-date` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: any;
  /** A String representing a date in the format of `yyyy-MM-dd HH:mm:ss` */
  DateString: any;
  /**
   * ISOString scalar - all datetimes fields are Typescript Date objects on this server &
   * returned as ISO-8601 encoded date strings (e.g. ISOString scalars) to GraphQL clients.
   * See Section 5.6 of the RFC 3339 profile of the ISO 8601 standard: https://www.ietf.org/rfc/rfc3339.txt.
   */
  ISOString: any;
  /**
   * A string formatted with CommonMark markdown,
   * plus the strikethrough extension from GFM.
   * This Scalar is for documentation purposes; otherwise
   * not treated differently from String in the API.
   */
  Markdown: any;
  /** Integers that will have a value of 0 or more. */
  NonNegativeInt: any;
  Upload: any;
  /** A URL - usually, for an interesting story on the internet that's worth saving to Pocket. */
  Url: any;
  ValidUrl: any;
  _FieldSet: any;
};

/** Indicates where in the Curation Tools UI the action took place */
export enum ActionScreen {
  /** This action took place from the corpus screen in the admin tool */
  Corpus = 'CORPUS',
  /** This action took place from the prospecting screen in the admin tool */
  Prospecting = 'PROSPECTING',
  /** This action took place from the schedule screen in the admin tool */
  Schedule = 'SCHEDULE',
  /** This action took place from the sections screen in the admin tool */
  Sections = 'SECTIONS',
}

/** The source of en entity */
export enum ActivitySource {
  /** Manually entered through the curation admin tool */
  Manual = 'MANUAL',
  /** Created by ML */
  Ml = 'ML',
}

export type ApprovedCorpusImageUrl = {
  __typename?: 'ApprovedCorpusImageUrl';
  /** The url of the image stored in the s3 bucket */
  url: Scalars['String'];
};

/** A prospective story that has been reviewed by the curators and saved to the corpus. */
export type ApprovedCorpusItem = {
  __typename?: 'ApprovedCorpusItem';
  /** The authors associated with this ApprovedCorpusItem. */
  authors: Array<CorpusItemAuthor>;
  /** A Unix timestamp of when the entity was created. */
  createdAt: Scalars['Int'];
  /** A single sign-on user identifier of the user who created this entity. */
  createdBy: Scalars['String'];
  /** The publication date for this story. */
  datePublished?: Maybe<Scalars['Date']>;
  /** The excerpt of the story. */
  excerpt: Scalars['String'];
  /** An alternative primary key in UUID format that is generated on creation. */
  externalId: Scalars['ID'];
  /** True if the domain of the corpus item has been scheduled in the past. */
  hasTrustedDomain: Scalars['Boolean'];
  /**
   * The image URL associated with the story.
   * This is a link to an S3 bucket - the image will have been pre-uploaded to S3 before saving a curated item.
   */
  imageUrl: Scalars['Url'];
  /** Whether this story is a Pocket Collection. */
  isCollection: Scalars['Boolean'];
  /** Whether this item is a syndicated article. */
  isSyndicated: Scalars['Boolean'];
  /**
   * Experimental data point that could imply either an expiry date or an urgency to be shown.
   * May be used for ML modeling.
   */
  isTimeSensitive: Scalars['Boolean'];
  /** What language this story is in. This is a two-letter code, for example, 'EN' for English. */
  language: CorpusLanguage;
  /** The GUID of the corresponding Prospect ID. Will be empty if the item was manually added. */
  prospectId?: Maybe<Scalars['ID']>;
  /** The name of the online publication that published this story. */
  publisher: Scalars['String'];
  /** Subquery to get the log of scheduled entries to display for a given Approved Item, most recent first. */
  scheduledSurfaceHistory: Array<ApprovedCorpusItemScheduledSurfaceHistory>;
  /** The source of the corpus item. */
  source: CorpusItemSource;
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

/** A prospective story that has been reviewed by the curators and saved to the corpus. */
export type ApprovedCorpusItemScheduledSurfaceHistoryArgs = {
  filters?: InputMaybe<ApprovedCorpusItemScheduledSurfaceHistoryFilters>;
};

/** The connection type for Approved Item. */
export type ApprovedCorpusItemConnection = {
  __typename?: 'ApprovedCorpusItemConnection';
  /** A list of edges. */
  edges: Array<ApprovedCorpusItemEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of Approved Items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection. */
export type ApprovedCorpusItemEdge = {
  __typename?: 'ApprovedCorpusItemEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The Approved Item at the end of the edge. */
  node: ApprovedCorpusItem;
};

/** Available fields for filtering Approved Items. */
export type ApprovedCorpusItemFilter = {
  /**
   * Optional filter on the language Approved Items have been classified as.
   * This is a two-letter string, e.g. 'EN' for English or 'DE' for 'German'.
   */
  language?: InputMaybe<CorpusLanguage>;
  /** Optional filter on the status of Approved Items. */
  status?: InputMaybe<CuratedStatus>;
  /** Optional filter on the title field. Returns partial matches. */
  title?: InputMaybe<Scalars['String']>;
  /** Optional filter on the topic field. */
  topic?: InputMaybe<Scalars['String']>;
  /** Optional filter on the URL field. Returns partial matches. */
  url?: InputMaybe<Scalars['Url']>;
};

export type ApprovedCorpusItemScheduledSurfaceHistory = {
  __typename?: 'ApprovedCorpusItemScheduledSurfaceHistory';
  /** A single sign-on user identifier of the user who created this entry. */
  createdBy: Scalars['String'];
  /**
   * An alternative primary key in UUID format that is generated on creation.
   * Note: this is the external ID of the scheduled entry, not the approved item.
   */
  externalId: Scalars['ID'];
  /**
   * The date the associated Approved Item is scheduled to appear on a Scheduled Surface.
   * This date is relative to the time zone of the Scheduled Surface. Format: YYYY-MM-DD.
   */
  scheduledDate: Scalars['Date'];
  /**
   * The GUID of the scheduledSurface to which the associated Approved Item is scheduled.
   * Example: 'NEW_TAB_EN_US'.
   */
  scheduledSurfaceGuid: Scalars['ID'];
};

/**
 * Available fields for filtering an Approved Item's history of being scheduled onto one or more
 * scheduled surfaces.
 */
export type ApprovedCorpusItemScheduledSurfaceHistoryFilters = {
  /** The maximum number of results to be returned. Default: 10. */
  limit?: InputMaybe<Scalars['NonNegativeInt']>;
  /**
   * The scheduled surface the results should be filtered to. Omitting this filter will
   * fetch results from all scheduled surfaces.
   */
  scheduledSurfaceGuid?: InputMaybe<Scalars['ID']>;
};

export type ArticleMarkdown = {
  __typename?: 'ArticleMarkdown';
  images?: Maybe<Array<MarkdownImagePosition>>;
  text: Scalars['String'];
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

/** Row in a bulleted (unordered list) */
export type BulletedListElement = ListElement & {
  __typename?: 'BulletedListElement';
  /** Row in a list. */
  content: Scalars['Markdown'];
  /** Zero-indexed level, for handling nested lists. */
  level: Scalars['Int'];
};

/**
 * Apollo Server @cacheControl directive caching behavior either for a single field, or for all fields that
 * return a particular type
 */
export enum CacheControlScope {
  Private = 'PRIVATE',
  Public = 'PUBLIC',
}

/** A requested image that is cached and has the requested image parameters */
export type CachedImage = {
  __typename?: 'CachedImage';
  /** Height of the cached image */
  height?: Maybe<Scalars['Int']>;
  /** Id of the image that matches the ID from the requested options */
  id: Scalars['ID'];
  /** URL of the cached image */
  url?: Maybe<Scalars['Url']>;
  /** Width of the cached image */
  width?: Maybe<Scalars['Int']>;
};

/** Set of parameters that will be used to change an image */
export type CachedImageInput = {
  /** File type of the requested image */
  fileType?: InputMaybe<ImageFileType>;
  /** Height of the image */
  height?: InputMaybe<Scalars['Int']>;
  /** ID that will be added to the generated response object so you can find it. NOTE: Can be any string that you like, it will be added to the response so you can use it when consuming it */
  id: Scalars['ID'];
  /** Quality of the image in whole percentage, 100 = full, quality 50 = half quality */
  qualityPercentage?: InputMaybe<Scalars['Int']>;
  /** Width of the image */
  width?: InputMaybe<Scalars['Int']>;
};

export type Collection = {
  __typename?: 'Collection';
  IABChildCategory?: Maybe<IabCategory>;
  /**
   * We will never return child categories in this type, so there's no need to
   * specify `IABParentCategory` here. The basic `IABCategory` is sufficient.
   */
  IABParentCategory?: Maybe<IabCategory>;
  authors: Array<CollectionAuthor>;
  curationCategory?: Maybe<CurationCategory>;
  excerpt?: Maybe<Scalars['Markdown']>;
  externalId: Scalars['ID'];
  imageUrl?: Maybe<Scalars['Url']>;
  intro?: Maybe<Scalars['Markdown']>;
  labels?: Maybe<Array<Maybe<Label>>>;
  /**
   * note that language is *not* being used as locale - only to specify the
   * language of the collection.
   */
  language: CollectionLanguage;
  partnership?: Maybe<CollectionPartnership>;
  publishedAt?: Maybe<Scalars['DateString']>;
  /**
   * Provides short url for the given_url in the format: https://pocket.co/<identifier>.
   * marked as beta because it's not ready yet for large client request.
   */
  shortUrl?: Maybe<Scalars['Url']>;
  slug: Scalars['String'];
  status: CollectionStatus;
  stories: Array<CollectionStory>;
  title: Scalars['String'];
};

export type CollectionAuthor = {
  __typename?: 'CollectionAuthor';
  active: Scalars['Boolean'];
  bio?: Maybe<Scalars['Markdown']>;
  externalId: Scalars['ID'];
  imageUrl?: Maybe<Scalars['Url']>;
  name: Scalars['String'];
  slug?: Maybe<Scalars['String']>;
};

export type CollectionAuthorsResult = {
  __typename?: 'CollectionAuthorsResult';
  authors: Array<CollectionAuthor>;
  pagination?: Maybe<Pagination>;
};

export type CollectionImageUploadInput = {
  fileSizeBytes: Scalars['Int'];
  height: Scalars['Int'];
  image: Scalars['Upload'];
  width: Scalars['Int'];
};

export type CollectionImageUrl = {
  __typename?: 'CollectionImageUrl';
  url: Scalars['String'];
};

export type CollectionInput = {
  excerpt: Scalars['String'];
  title: Scalars['String'];
};

/** valid language codes for collections */
export enum CollectionLanguage {
  /** German */
  De = 'DE',
  /** English */
  En = 'EN',
}

/** Details of a partner company sponsored collections are associated with. */
export type CollectionPartner = {
  __typename?: 'CollectionPartner';
  blurb: Scalars['Markdown'];
  externalId: Scalars['String'];
  imageUrl: Scalars['Url'];
  name: Scalars['String'];
  url: Scalars['Url'];
};

/**
 * If a collection was made in partnership with an external company, this
 * entity will hold all required info about that partnership.
 *
 * Note that this admin-only type exposes both the optional customized fields
 * and the CollectionPartner entity with the default values.
 *
 * The consolidated CollectionPartnership type is available in the public schema.
 */
export type CollectionPartnerAssociation = {
  __typename?: 'CollectionPartnerAssociation';
  blurb?: Maybe<Scalars['Markdown']>;
  externalId: Scalars['String'];
  imageUrl?: Maybe<Scalars['Url']>;
  name?: Maybe<Scalars['String']>;
  partner: CollectionPartner;
  type: CollectionPartnershipType;
  url?: Maybe<Scalars['Url']>;
};

export type CollectionPartnersResult = {
  __typename?: 'CollectionPartnersResult';
  pagination?: Maybe<Pagination>;
  partners: Array<CollectionPartner>;
};

/**
 * If a collection was made in partnership with an external company, this
 * entity will hold all required info about that partnership.
 */
export type CollectionPartnership = {
  __typename?: 'CollectionPartnership';
  blurb: Scalars['Markdown'];
  externalId: Scalars['String'];
  imageUrl: Scalars['Url'];
  name: Scalars['String'];
  type: CollectionPartnershipType;
  url: Scalars['Url'];
};

/** Type and enums related to Collections made in partnership with a company. */
export enum CollectionPartnershipType {
  Partnered = 'PARTNERED',
  Sponsored = 'SPONSORED',
}

export enum CollectionStatus {
  Archived = 'ARCHIVED',
  Draft = 'DRAFT',
  Published = 'PUBLISHED',
  Review = 'REVIEW',
}

export type CollectionStory = {
  __typename?: 'CollectionStory';
  authors: Array<CollectionStoryAuthor>;
  excerpt: Scalars['Markdown'];
  externalId: Scalars['ID'];
  /** if True, the story is provided by a partner and should be displayed as such */
  fromPartner: Scalars['Boolean'];
  imageUrl?: Maybe<Scalars['Url']>;
  item?: Maybe<Item>;
  publisher?: Maybe<Scalars['String']>;
  sortOrder?: Maybe<Scalars['Int']>;
  title: Scalars['String'];
  url: Scalars['Url'];
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
  collections: Array<Collection>;
  pagination: Pagination;
};

/**
 * Represents an item that is in the Corpus and its associated manually edited metadata.
 * TODO: CorpusItem to implement PocketResource when it becomes available.
 * not actively required or consumed by admin subgraph
 * Only exposed here to avoid conflicts with other admin-subgraph when we extend the field
 */
export type CorpusItem = {
  __typename?: 'CorpusItem';
  /**
   * Provides short url for the given_url in the format: https://pocket.co/<identifier>.
   * marked as beta because it's not ready yet for large client request.
   */
  shortUrl?: Maybe<Scalars['Url']>;
  /** Time to read in minutes. Is nullable. */
  timeToRead?: Maybe<Scalars['Int']>;
  /** The URL of the Approved Item. */
  url: Scalars['Url'];
};

/** An author associated with a CorpusItem. */
export type CorpusItemAuthor = {
  __typename?: 'CorpusItemAuthor';
  name: Scalars['String'];
  sortOrder: Scalars['Int'];
};

/** An author associated with a CorpusItem. */
export type CorpusItemAuthorInput = {
  name: Scalars['String'];
  sortOrder: Scalars['Int'];
};

/** The source of the corpus item */
export enum CorpusItemSource {
  /** Imported from the legacy database */
  Backfill = 'BACKFILL',
  /** Manually entered through the curation admin tool */
  Manual = 'MANUAL',
  /** Created by ML */
  Ml = 'ML',
  /** Originated as a prospect in the curation admin tool */
  Prospect = 'PROSPECT',
}

/** Valid language codes for curated corpus items. */
export enum CorpusLanguage {
  /** German */
  De = 'DE',
  /** English */
  En = 'EN',
  /** Spanish */
  Es = 'ES',
  /** French */
  Fr = 'FR',
  /** Italian */
  It = 'IT',
}

/** A node in a CorpusSearchConnection result */
export type CorpusSearchNode = {
  __typename?: 'CorpusSearchNode';
  /** Attaches the item so we can use the preview field */
  item?: Maybe<Item>;
};

/** Input data for creating an Approved Item and optionally scheduling this item to appear on a Scheduled Surface. */
export type CreateApprovedCorpusItemInput = {
  /** The UI screen where the approved corpus item is being created from. */
  actionScreen?: InputMaybe<ActionScreen>;
  /** A name and sort order for each author. */
  authors: Array<CorpusItemAuthorInput>;
  /** The publication date for this story. */
  datePublished?: InputMaybe<Scalars['Date']>;
  /** The excerpt of the Approved Item. */
  excerpt: Scalars['String'];
  /** The image URL for this item's accompanying picture. */
  imageUrl: Scalars['Url'];
  /** Whether this story is a Pocket Collection. */
  isCollection: Scalars['Boolean'];
  /** Whether this item is a syndicated article. */
  isSyndicated: Scalars['Boolean'];
  /**
   * A flag to ML to not recommend this item long term after it is added to the corpus.
   * Example: a story covering an election, or "The best of 202x" collection.
   */
  isTimeSensitive: Scalars['Boolean'];
  /** What language this item is in. This is a two-letter code, for example, 'EN' for English. */
  language: CorpusLanguage;
  /** The GUID of the corresponding Prospect ID. Will be empty for manually added items. */
  prospectId?: InputMaybe<Scalars['ID']>;
  /** The name of the online publication that published this story. */
  publisher: Scalars['String'];
  /** Optionally, specify the date this item should be appearing on a Scheduled Surface. Format: YYYY-MM-DD */
  scheduledDate?: InputMaybe<Scalars['Date']>;
  /** Optionally, specify the source of the Scheduled Item. Could be one of: MANUAL or ML */
  scheduledSource?: InputMaybe<ActivitySource>;
  /** Optionally, specify the GUID of the Scheduled Surface this item should be scheduled for. */
  scheduledSurfaceGuid?: InputMaybe<Scalars['ID']>;
  /** The source of the corpus item. */
  source: CorpusItemSource;
  /** The outcome of the curators' review of the Approved Item. */
  status: CuratedStatus;
  /** The title of the Approved Item. */
  title: Scalars['String'];
  /** A topic this story best fits in. */
  topic: Scalars['String'];
  /** The URL of the Approved Item. */
  url: Scalars['Url'];
};

export type CreateCollectionAuthorInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  bio?: InputMaybe<Scalars['Markdown']>;
  imageUrl?: InputMaybe<Scalars['Url']>;
  name: Scalars['String'];
  slug?: InputMaybe<Scalars['String']>;
};

export type CreateCollectionInput = {
  IABChildCategoryExternalId?: InputMaybe<Scalars['String']>;
  IABParentCategoryExternalId?: InputMaybe<Scalars['String']>;
  authorExternalId: Scalars['String'];
  curationCategoryExternalId?: InputMaybe<Scalars['String']>;
  excerpt?: InputMaybe<Scalars['Markdown']>;
  imageUrl?: InputMaybe<Scalars['Url']>;
  intro?: InputMaybe<Scalars['Markdown']>;
  labelExternalIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  language: CollectionLanguage;
  slug: Scalars['String'];
  status?: InputMaybe<CollectionStatus>;
  title: Scalars['String'];
};

export type CreateCollectionPartnerAssociationInput = {
  blurb?: InputMaybe<Scalars['Markdown']>;
  collectionExternalId: Scalars['String'];
  imageUrl?: InputMaybe<Scalars['Url']>;
  name?: InputMaybe<Scalars['String']>;
  partnerExternalId: Scalars['String'];
  type: CollectionPartnershipType;
  url?: InputMaybe<Scalars['Url']>;
};

export type CreateCollectionPartnerInput = {
  blurb: Scalars['Markdown'];
  imageUrl: Scalars['Url'];
  name: Scalars['String'];
  url: Scalars['Url'];
};

export type CreateCollectionStoryInput = {
  authors: Array<CollectionStoryAuthorInput>;
  collectionExternalId: Scalars['String'];
  excerpt: Scalars['Markdown'];
  fromPartner?: InputMaybe<Scalars['Boolean']>;
  imageUrl: Scalars['Url'];
  publisher: Scalars['String'];
  sortOrder?: InputMaybe<Scalars['Int']>;
  title: Scalars['String'];
  url: Scalars['Url'];
};

/** Input data for creating a Custom Editorial Section */
export type CreateCustomSectionInput = {
  /** Indicates whether or not a Section is available for display. */
  active: Scalars['Boolean'];
  /** The source which created the Section. */
  createSource: ActivitySource;
  /** The description of the custom section displayed to the users. */
  description: Scalars['String'];
  /**
   * Indicates whether or not a Section is fully disabled from display on NewTab. Can only  be controlled
   * in the admin tool.
   */
  disabled: Scalars['Boolean'];
  /**
   * An optional date of when the Section should stop being displayed.
   * Format: YYYY-MM-DD.
   */
  endDate?: InputMaybe<Scalars['Date']>;
  /** An optional description or supporting text for use in hero modules. */
  heroDescription?: InputMaybe<Scalars['String']>;
  /** An optional title used in hero modules. */
  heroTitle?: InputMaybe<Scalars['String']>;
  /** Optional IAB metadata input */
  iab?: InputMaybe<IabMetadataInput>;
  /** The GUID of the Scheduled Surface. Example: 'NEW_TAB_EN_US'. */
  scheduledSurfaceGuid: Scalars['ID'];
  /** Controls the display order of Sections. */
  sort?: InputMaybe<Scalars['Int']>;
  /**
   * The date of when the Section should go "live" for display on NewTab.
   * Current & future dates allowed.
   * Format: YYYY-MM-DD.
   */
  startDate: Scalars['Date'];
  /** The title of the custom section displayed to the users. */
  title: Scalars['String'];
};

/** Input data for creating a Section */
export type CreateOrUpdateSectionInput = {
  /** Indicates whether or not a Section is available for display. */
  active: Scalars['Boolean'];
  /** The source which created the Section. */
  createSource: ActivitySource;
  /** The optional description of the Section displayed to the users. */
  description?: InputMaybe<Scalars['String']>;
  /** An alternative primary key in UUID format supplied by ML. */
  externalId: Scalars['ID'];
  /** Optional IAB metadata input */
  iab?: InputMaybe<IabMetadataInput>;
  /** The GUID of the Scheduled Surface. Example: 'NEW_TAB_EN_US'. */
  scheduledSurfaceGuid: Scalars['ID'];
  /** Controls the display order of Sections. */
  sort?: InputMaybe<Scalars['Int']>;
  /** The title of the Section displayed to the users. */
  title: Scalars['String'];
};

/** Input data for creating a Rejected Item. */
export type CreateRejectedCorpusItemInput = {
  /**
   * The UI screen where the rejected corpus item is being created from.
   * Currently only available on prospect screen.
   */
  actionScreen?: InputMaybe<ActionScreen>;
  /** What language this item is in. This is a two-letter code, for example, 'EN' for English. */
  language?: InputMaybe<CorpusLanguage>;
  /** The GUID of the corresponding Prospect ID. Will be empty for manually added item. */
  prospectId?: InputMaybe<Scalars['ID']>;
  /** The name of the online publication that published this story. */
  publisher?: InputMaybe<Scalars['String']>;
  /** A comma-separated list of rejection reasons. */
  reason: Scalars['String'];
  /** The title of the Rejected Item. */
  title?: InputMaybe<Scalars['String']>;
  /**
   * A topic this story best fits in.
   * Temporarily a string value that will be provided by Prospect API, possibly an enum in the future.
   */
  topic: Scalars['String'];
  /** The URL of the Rejected Item. */
  url: Scalars['Url'];
};

/**
 * Input data for marking the given scheduled surface as reviewed
 * by human curators for a given date.
 */
export type CreateScheduleReviewInput = {
  /** The date of the schedule that was reviewed, in YYYY-MM-DD format. */
  scheduledDate: Scalars['Date'];
  /** The GUID of the scheduledSurface that was reviewed. */
  scheduledSurfaceGuid: Scalars['ID'];
};

/** Input data for creating a scheduled entry for an Approved Item on a Scheduled Surface. */
export type CreateScheduledCorpusItemInput = {
  /**
   * The UI screen where the scheduled corpus item is being created from.
   * Can be from the prospecting, corpus, or schedule screens.
   */
  actionScreen?: InputMaybe<ActionScreen>;
  /** The ID of the Approved Item that needs to be scheduled. */
  approvedItemExternalId: Scalars['ID'];
  /** Free-text entered by the curator to give further detail to the manual schedule reason(s) provided. */
  reasonComment?: InputMaybe<Scalars['String']>;
  /** A comma-separated list of reasons for manually scheduling an item. Helps ML improve models for sets of scheduled items. */
  reasons?: InputMaybe<Scalars['String']>;
  /** The date the associated Approved Item is scheduled to appear on a Scheduled Surface. Format: YYYY-MM-DD. */
  scheduledDate: Scalars['Date'];
  /** The GUID of the Scheduled Surface the Approved Item is going to appear on. Example: 'NEW_TAB_EN_US'. */
  scheduledSurfaceGuid: Scalars['ID'];
  /** Source of the Scheduled Item. Could be one of: MANUAL or ML */
  source: ActivitySource;
};

/** Input data for adding a SectionItem to a Section */
export type CreateSectionItemInput = {
  /** The ID of the ApprovedItem backing the SectionItem. */
  approvedItemExternalId: Scalars['ID'];
  /**
   * The initial rank of the SectionItem in relation to its siblings. Used as a
   * fallback in Merino when there is no engagement/click data available. May only apply to
   * ML-generated SectionItems.
   */
  rank?: InputMaybe<Scalars['Int']>;
  /** The ID of the Section to contain the new SectionItem. */
  sectionExternalId: Scalars['ID'];
};

/** The outcome of the curators reviewing a prospective story. */
export enum CuratedStatus {
  /** This story is suitable for our curated corpus. It's a second-tier recommendation. */
  Corpus = 'CORPUS',
  /** Recommend this story for Pocket users. This is first-tier content. */
  Recommendation = 'RECOMMENDATION',
}

export type CurationCategory = {
  __typename?: 'CurationCategory';
  externalId: Scalars['ID'];
  name: Scalars['String'];
  slug: Scalars['String'];
};

export type DeleteCollectionPartnerAssociationInput = {
  externalId: Scalars['String'];
};

/** Input data for deleting a scheduled item for a Scheduled Surface. */
export type DeleteScheduledCorpusItemInput = {
  /**
   * The UI screen where the scheduled corpus item is being deleted from.
   * Can only be from the schedule screen.
   */
  actionScreen?: InputMaybe<ActionScreen>;
  /** ID of the scheduled item. A string in UUID format. */
  externalId: Scalars['ID'];
  /** Free-text entered by the curator to give further detail to the reason(s) provided. */
  reasonComment?: InputMaybe<Scalars['String']>;
  /** A comma-separated list of unschedule reasons. */
  reasons?: InputMaybe<Scalars['String']>;
};

/** Input data for disabling or enabling a Section */
export type DisableEnableSectionInput = {
  /**
   * Indicates whether or not a Section is fully disabled from display on NewTab. Can only  be controlled
   * in the admin tool.
   */
  disabled: Scalars['Boolean'];
  /** An alternative primary key in UUID format supplied by ML. */
  externalId: Scalars['ID'];
};

/** Metadata from a domain, originally populated from ClearBit */
export type DomainMetadata = {
  __typename?: 'DomainMetadata';
  /** Url for the logo image */
  logo?: Maybe<Scalars['Url']>;
  /** Url for the greyscale logo image */
  logoGreyscale?: Maybe<Scalars['Url']>;
  /** The name of the domain (e.g., The New York Times) */
  name?: Maybe<Scalars['String']>;
};

export type GetProspectsFilters = {
  /**
   * Filter out any prospects by the name or part-match of the name of a publisher, e.g. 'The Onion'.
   * Note that this filter is case-sensitive due to DynamoDB limitations.
   */
  excludePublisher?: InputMaybe<Scalars['String']>;
  /**
   * Filter the returned prospects by the name or part-match of the name of a publisher, e.g. 'The Onion'.
   * Note that this filter is case-sensitive due to DynamoDB limitations.
   */
  includePublisher?: InputMaybe<Scalars['String']>;
  /** string GUID of the prospect type to further filter prospects, e.g. 'GLOBAL' or 'ORGANIC_TIMESPENT' */
  prospectType?: InputMaybe<Scalars['String']>;
  /** string GUID of the scheduled surface being prospected, e.g. 'NEW_TAB_EN_US' or 'POCKET_HITS_DE_DE' */
  scheduledSurfaceGuid: Scalars['String'];
};

/** Interactive Advertising Bureau Category - these are used on clients to serve relevant ads */
export type IabCategory = {
  __typename?: 'IABCategory';
  externalId: Scalars['String'];
  name: Scalars['String'];
  slug: Scalars['String'];
};

/**
 * Represents IAB metadata for a Section.
 * Used by both admin input/output and public output.
 */
export type IabMetadata = {
  __typename?: 'IABMetadata';
  categories: Array<Scalars['String']>;
  taxonomy: Scalars['String'];
};

/** Input data for creating IAB metadata for a Section */
export type IabMetadataInput = {
  categories: Array<Scalars['String']>;
  taxonomy: Scalars['String'];
};

export type IabParentCategory = {
  __typename?: 'IABParentCategory';
  children: Array<IabCategory>;
  externalId: Scalars['String'];
  name: Scalars['String'];
  slug: Scalars['String'];
};

/** An image that is keyed on URL */
export type Image = {
  __typename?: 'Image';
  /** Query to get a cached and modified set of images based on the image from the original url, images will be matched by the client assigned id value */
  cachedImages?: Maybe<Array<Maybe<CachedImage>>>;
  /** A caption or description of the image */
  caption?: Maybe<Scalars['String']>;
  /** A credit for the image, typically who the image belongs to / created by */
  credit?: Maybe<Scalars['String']>;
  /** The determined height of the image at the url */
  height?: Maybe<Scalars['Int']>;
  /** The id for placing within an Article View. Item.article will have placeholders of <div id='RIL_IMG_X' /> where X is this id. Apps can download those images as needed and populate them in their article view. */
  imageId: Scalars['Int'];
  /**
   * Absolute url to the image
   * @deprecated use url property moving forward
   */
  src: Scalars['String'];
  /** If the image is also a link, the destination url */
  targetUrl?: Maybe<Scalars['String']>;
  /** The url of the image */
  url: Scalars['Url'];
  /** The determined width of the image at the url */
  width?: Maybe<Scalars['Int']>;
};

/** An image that is keyed on URL */
export type ImageCachedImagesArgs = {
  imageOptions: Array<CachedImageInput>;
};

/** The image file type */
export enum ImageFileType {
  Jpeg = 'JPEG',
  Png = 'PNG',
  Webp = 'WEBP',
}

export enum Imageness {
  /** Contains images (v3 value is 1) */
  HasImages = 'HAS_IMAGES',
  /** Is an image (v3 value is 2) */
  IsImage = 'IS_IMAGE',
  /** No images (v3 value is 0) */
  NoImages = 'NO_IMAGES',
}

/**
 * The heart of Pocket
 * A url and meta data related to it.
 */
export type Item = {
  __typename?: 'Item';
  /** If available, the url to an AMP version of this article */
  ampUrl?: Maybe<Scalars['Url']>;
  /**
   * The pocket HTML string of the article.
   * Note: Web and Android as of 3/4/2022 use the Article field, any improvements made
   * within MArticle for parsing will not be reflected in the article field.
   * When that happens, the clients will work to move to MArticle.
   */
  article?: Maybe<Scalars['String']>;
  /** List of Authors involved with this article */
  authors?: Maybe<Array<Maybe<Author>>>;
  /** If the item is a collection allow them to get the collection information */
  collection?: Maybe<Collection>;
  /**
   * The length in bytes of the content
   * @deprecated Clients should not use this
   */
  contentLength?: Maybe<Scalars['Int']>;
  /** The date the article was published */
  datePublished?: Maybe<Scalars['DateString']>;
  /** The date the parser resolved this item */
  dateResolved?: Maybe<Scalars['DateString']>;
  /** The domain, such as 'getpocket.com' of the resolved_url */
  domain?: Maybe<Scalars['String']>;
  /**
   * The primary database id of the domain this article is from
   * @deprecated Use a domain as the identifier instead
   */
  domainId?: Maybe<Scalars['String']>;
  /** Additional information about the item domain, when present, use this for displaying the domain name */
  domainMetadata?: Maybe<DomainMetadata>;
  /** The string encoding code of this item's web page */
  encoding?: Maybe<Scalars['String']>;
  /** A snippet of text from the article */
  excerpt?: Maybe<Scalars['String']>;
  /** key field to identify the Item entity in the Parser service */
  givenUrl: Scalars['Url'];
  /** 0=no images, 1=contains images, 2=is an image */
  hasImage?: Maybe<Imageness>;
  /**
   * Indicates that the item was stored via a different search_hash (using the old method), we'll need to look up a different id
   * @deprecated Most new items use a new hash
   */
  hasOldDupes?: Maybe<Scalars['Boolean']>;
  /** 0=no videos, 1=contains video, 2=is a video */
  hasVideo?: Maybe<Videoness>;
  /** A server generated unique id for this item based on itemId */
  id: Scalars['ID'];
  /** Array of images within an article */
  images?: Maybe<Array<Maybe<Image>>>;
  /**
   * Indicates if the text of the url is a redirect to another url
   * @deprecated Clients should not use this
   */
  innerDomainRedirect?: Maybe<Scalars['Boolean']>;
  /** true if the item is an article */
  isArticle?: Maybe<Scalars['Boolean']>;
  /** true if the item is an index / home page, rather than a specific single piece of content */
  isIndex?: Maybe<Scalars['Boolean']>;
  /** A server generated unique id for this item. Item's whose normalUrl are the same will have the same item_id. Most likely numeric, but to ensure future proofing this can be treated as a String in apps. */
  itemId: Scalars['String'];
  /** The detected language of the article */
  language?: Maybe<Scalars['String']>;
  /** Estimated time to listen to the article, in seconds */
  listenDuration?: Maybe<Scalars['Int']>;
  /**
   * Indicates if the url requires a login
   * @deprecated Clients should not use this
   */
  loginRequired?: Maybe<Scalars['Boolean']>;
  /** The Marticle format of the article, used by clients for native article view. */
  marticle?: Maybe<Array<MarticleComponent>>;
  /** The mime type of this item's web page */
  mimeType?: Maybe<Scalars['String']>;
  /**
   * A normalized value of the givenUrl.
   * It will look like a url but is not guaranteed to be a valid url, just a unique string that is used to eliminate common duplicates.
   * Item's that share a normal_url should be considered the same item. For example https://getpocket.com and http://getpocket.com will be considered the same since they both normalize to http://getpocket.com
   * This is technically the true identity of an item, since this is what the backend uses to tell if two items are the same.
   * However, for the clients to use this, they would all have to ship an implementation of the normalization function that the backend has exactly.
   * And even if it did that, some items, some of the earliest saves, use a legacy normalize function and the client would have no way to know when to use which normalizing function.
   */
  normalUrl: Scalars['String'];
  /**
   * If a the domainId is a subdomain this is the primary domain id
   * @deprecated Use a domain as the identifier instead
   */
  originDomainId?: Maybe<Scalars['String']>;
  /** The client preview/display logic for this url */
  preview?: Maybe<PocketMetadata>;
  /** A server generated unique reader slug for this item based on itemId */
  readerSlug: Scalars['String'];
  /** The item id of the resolved_url */
  resolvedId?: Maybe<Scalars['String']>;
  /**
   * The resolved url, but ran through the normalized function
   * @deprecated Use the resolved url instead
   */
  resolvedNormalUrl?: Maybe<Scalars['Url']>;
  /** If the givenUrl redirects (once or many times), this is the final url. Otherwise, same as givenUrl */
  resolvedUrl?: Maybe<Scalars['Url']>;
  /**
   * The http response code of the given url
   * @deprecated Clients should not use this
   */
  responseCode?: Maybe<Scalars['Int']>;
  /**
   * Provides short url for the given_url in the format: https://pocket.co/<identifier>.
   * marked as beta because it's not ready yet for large client request.
   */
  shortUrl?: Maybe<Scalars['Url']>;
  /** If the url is an Article, the text in SSML format for speaking, i.e. Listen */
  ssml?: Maybe<Scalars['String']>;
  /**
   * Date this item was first parsed in Pocket
   * @deprecated Clients should not use this
   */
  timeFirstParsed?: Maybe<Scalars['DateString']>;
  /** How long it will take to read the article (TODO in what time unit? and by what calculation?) */
  timeToRead?: Maybe<Scalars['Int']>;
  /** The title as determined by the parser. */
  title?: Maybe<Scalars['String']>;
  /** The page's / publisher's preferred thumbnail image */
  topImage?: Maybe<Image>;
  /**
   * The page's / publisher's preferred thumbnail image
   * @deprecated use the topImage object
   */
  topImageUrl?: Maybe<Scalars['Url']>;
  /**
   * Indicates if the parser used fallback methods
   * @deprecated Clients should not use this
   */
  usedFallback?: Maybe<Scalars['Int']>;
  /** Array of videos within the item If the item is a video, this will likely just contain one video */
  videos?: Maybe<Array<Maybe<Video>>>;
  /** Number of words in the article */
  wordCount?: Maybe<Scalars['Int']>;
};

export type ItemNotFound = {
  __typename?: 'ItemNotFound';
  message?: Maybe<Scalars['String']>;
};

export type ItemSummary = PocketMetadata & {
  __typename?: 'ItemSummary';
  authors?: Maybe<Array<Author>>;
  datePublished?: Maybe<Scalars['ISOString']>;
  domain?: Maybe<DomainMetadata>;
  excerpt?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  image?: Maybe<Image>;
  item?: Maybe<Item>;
  source: PocketMetadataSource;
  title?: Maybe<Scalars['String']>;
  url: Scalars['Url'];
};

/** A label used to mark and categorize an Entity (e.g. Collection). */
export type Label = {
  __typename?: 'Label';
  externalId: Scalars['ID'];
  name: Scalars['String'];
};

export type ListElement = {
  /** Row in a list. */
  content: Scalars['Markdown'];
  /** Zero-indexed level, for handling nested lists. */
  level: Scalars['Int'];
};

/** The Connection type for ListItem */
export type ListItemConnection = {
  __typename?: 'ListItemConnection';
  /** A list of edges. */
  edges?: Maybe<Array<ListItemEdge>>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of SavedItems in the connection. */
  totalCount: Scalars['Int'];
};

/** An Edge in a Connection */
export type ListItemEdge = {
  __typename?: 'ListItemEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The ListItem at the end of the edge. */
  node: ShareableListItem;
};

/**
 * Reasons for manually scheduling a corpus item.
 *
 * This is used by ML downstream to improve their modeling.
 */
export enum ManualScheduleReason {
  Evergreen = 'EVERGREEN',
  FormatDiversity = 'FORMAT_DIVERSITY',
  PublisherDiversity = 'PUBLISHER_DIVERSITY',
  TimeSensitiveExplainer = 'TIME_SENSITIVE_EXPLAINER',
  TimeSensitiveNews = 'TIME_SENSITIVE_NEWS',
  TopicDiversity = 'TOPIC_DIVERSITY',
  Trending = 'TRENDING',
  UnderTheRadar = 'UNDER_THE_RADAR',
}

export type MarkdownImagePosition = {
  __typename?: 'MarkdownImagePosition';
  index: Scalars['Int'];
  position: Scalars['Int'];
  /** Fallback is to use the images field in the Item entity */
  src?: Maybe<Scalars['String']>;
};

/** Content of a blockquote */
export type MarticleBlockquote = {
  __typename?: 'MarticleBlockquote';
  /** Markdown text content. */
  content: Scalars['Markdown'];
};

/** Content in a bulleted (unordered) list. */
export type MarticleBulletedList = {
  __typename?: 'MarticleBulletedList';
  rows: Array<BulletedListElement>;
};

/** A pre formatted text in the HTML content. */
export type MarticleCodeBlock = {
  __typename?: 'MarticleCodeBlock';
  /** Assuming the codeblock was a programming language, this field is used to identify it. */
  language?: Maybe<Scalars['Int']>;
  /** Content of a pre tag */
  text: Scalars['String'];
};

export type MarticleComponent =
  | Image
  | MarticleBlockquote
  | MarticleBulletedList
  | MarticleCodeBlock
  | MarticleDivider
  | MarticleHeading
  | MarticleNumberedList
  | MarticleTable
  | MarticleText
  | UnMarseable
  | Video;

export type MarticleDivider = {
  __typename?: 'MarticleDivider';
  /** Always '---'; provided for convenience if building a markdown string */
  content: Scalars['Markdown'];
};

/** A heading in an article, with markdown formatting. */
export type MarticleHeading = {
  __typename?: 'MarticleHeading';
  /** Heading text, in markdown. */
  content: Scalars['Markdown'];
  /** Heading level. Restricted to values 1-6. */
  level: Scalars['Int'];
};

/** Content in a bulleted (unordered) list. */
export type MarticleNumberedList = {
  __typename?: 'MarticleNumberedList';
  rows: Array<NumberedListElement>;
};

/** Content in a table. */
export type MarticleTable = {
  __typename?: 'MarticleTable';
  /** Raw HTML representation of the table. */
  html: Scalars['String'];
};

/**
 * A section of the article's text content, in markdown.
 * A subset of gfm is supported. See README.md for more information.
 */
export type MarticleText = {
  __typename?: 'MarticleText';
  /** Markdown text content. Typically, a paragraph. */
  content: Scalars['Markdown'];
};

/** Input data for removing (moderating) a ShareableList */
export type ModerateShareableListInput = {
  externalId: Scalars['ID'];
  moderationDetails?: InputMaybe<Scalars['String']>;
  moderationReason?: InputMaybe<ShareableListModerationReason>;
  moderationStatus: ShareableListModerationStatus;
  restorationReason?: InputMaybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  /**
   * Uploads an image to S3. Does *not* save the image to any entity
   * (CollectionAuthor/Collection/CollectionStory).
   */
  collectionImageUpload: CollectionImageUrl;
  /** Creates an Approved Item and optionally schedules it to appear on a Scheduled Surface. */
  createApprovedCorpusItem: ApprovedCorpusItem;
  /** Creates a Collection. */
  createCollection: Collection;
  /** Creates a CollectionAuthor. */
  createCollectionAuthor: CollectionAuthor;
  /** Creates a CollectionPartner. */
  createCollectionPartner: CollectionPartner;
  /** Creates a CollectionPartnerAssociation. */
  createCollectionPartnerAssociation: CollectionPartnerAssociation;
  /** Creates a CollectionStory. */
  createCollectionStory: CollectionStory;
  /**
   * Creates a new custom editorial section entity.
   * This mutation is to be used by curators via admin tool.
   */
  createCustomSection: Section;
  /** Creates a Label. */
  createLabel: Label;
  /**
   * Creates a new Section entity. If a Section already exists, the existing
   * Section gets updated, associated active SectionItems are set to in-active.
   * This mutation is to be used by ML-automated processes.
   */
  createOrUpdateSection: Section;
  /** Creates a Rejected Item. */
  createRejectedCorpusItem: RejectedCorpusItem;
  /** Marks the given scheduled surface as reviewed by human curators for a given date. */
  createScheduleReview: ScheduleReview;
  /** Creates a Scheduled Surface Scheduled Item. */
  createScheduledCorpusItem: ScheduledCorpusItem;
  /** Creates a SectionItem within a Section. */
  createSectionItem: SectionItem;
  /** Deletes a CollectionPartnerAssociation. */
  deleteCollectionPartnerAssociation: CollectionPartnerAssociation;
  /** Deletes a CollectionStory. Also deletes all the related CollectionStoryAuthor records. */
  deleteCollectionStory: CollectionStory;
  /**
   * Deletes a custom section. This is a soft-delete & the Section
   * and it's SectionItems are marked as in-active.
   * This mutation is to be used by curators via admin tool.
   */
  deleteCustomSection: Section;
  /** Deletes an item from a Scheduled Surface. */
  deleteScheduledCorpusItem: ScheduledCorpusItem;
  /** Disables or enables a Section. Can only be done from the admin tool. */
  disableEnableSection: Section;
  /** Removes (moderates) a Shareable List. */
  moderateShareableList?: Maybe<ShareableListComplete>;
  /** Refresh an Item's article content. */
  refreshItemArticle: Item;
  /**
   * Rejects an Approved Item: deletes it from the corpus and creates a Rejected Item instead.
   * Also deletes all associated SectionItems.
   */
  rejectApprovedCorpusItem: ApprovedCorpusItem;
  /**
   * Marks a prospect as 'curated' in the database, preventing it from being displayed for prospecting.
   * Returns the prospect if the operation succeeds, and null if not (almost surely due to an incorrect id).
   *
   * Called when removing a prospect from the list - specifically not approving or rejecting into the corpus.
   */
  removeProspect?: Maybe<Prospect>;
  /** Removes an active SectionItem from a Section. */
  removeSectionItem: SectionItem;
  /** Updates the scheduled date of a Scheduled Surface Scheduled Item. */
  rescheduleScheduledCorpusItem: ScheduledCorpusItem;
  /** Updates an Approved Item. */
  updateApprovedCorpusItem: ApprovedCorpusItem;
  /** Updates a Collection. */
  updateCollection: Collection;
  /** Updates a CollectionAuthor. */
  updateCollectionAuthor: CollectionAuthor;
  /**
   * Updates only the `imageUrl` property of a CollectionAuthor.
   * Dedicated to uploading images within the UI.
   */
  updateCollectionAuthorImageUrl: CollectionAuthor;
  /**
   * Updates only the `imageUrl` property of a Collection.
   * Dedicated to uploading images within the UI.
   */
  updateCollectionImageUrl: Collection;
  /** Updates a CollectionPartner. */
  updateCollectionPartner: CollectionPartner;
  /** Updates a CollectionPartnerAssociation. */
  updateCollectionPartnerAssociation: CollectionPartnerAssociation;
  /**
   * Updates only the `imageUrl` property of a CollectionPartner.
   * Dedicated to uploading images within the UI.
   */
  updateCollectionPartnerAssociationImageUrl: CollectionPartnerAssociation;
  /**
   * Updates only the `imageUrl` property of a CollectionPartner.
   * Dedicated to uploading images within the UI.
   */
  updateCollectionPartnerImageUrl: CollectionPartner;
  /** Updates a CollectionStory. */
  updateCollectionStory: CollectionStory;
  /**
   * Updates only the `imageUrl` property of a CollectionStory.
   * Dedicated to uploading images within the UI.
   */
  updateCollectionStoryImageUrl: CollectionStory;
  /**
   * Updates only the `sortOrder` property of a CollectionStory.
   * Dedicated to ordering stories within the UI.
   */
  updateCollectionStorySortOrder: CollectionStory;
  /**
   * Updates an existing custom editorial section entity.
   * This mutation is to be used by curators via admin tool.
   */
  updateCustomSection: Section;
  /** Updates a Label that is not assigned to any Collection yet. */
  updateLabel: Label;
  /**
   * Marks a prospect as 'curated' in the database, preventing it from being displayed for prospecting.
   * Returns the prospect if the operation succeeds, and null if not (almost surely due to an incorrect id).
   *
   * Called when approving or rejecting a prospect into the corpus.
   */
  updateProspectAsCurated?: Maybe<Prospect>;
  /** Uploads an image to S3 for an Approved Item */
  uploadApprovedCorpusItemImage: ApprovedCorpusImageUrl;
};

export type MutationCollectionImageUploadArgs = {
  data: CollectionImageUploadInput;
};

export type MutationCreateApprovedCorpusItemArgs = {
  data: CreateApprovedCorpusItemInput;
};

export type MutationCreateCollectionArgs = {
  data: CreateCollectionInput;
};

export type MutationCreateCollectionAuthorArgs = {
  data: CreateCollectionAuthorInput;
};

export type MutationCreateCollectionPartnerArgs = {
  data: CreateCollectionPartnerInput;
};

export type MutationCreateCollectionPartnerAssociationArgs = {
  data: CreateCollectionPartnerAssociationInput;
};

export type MutationCreateCollectionStoryArgs = {
  data: CreateCollectionStoryInput;
};

export type MutationCreateCustomSectionArgs = {
  data: CreateCustomSectionInput;
};

export type MutationCreateLabelArgs = {
  name: Scalars['String'];
};

export type MutationCreateOrUpdateSectionArgs = {
  data: CreateOrUpdateSectionInput;
};

export type MutationCreateRejectedCorpusItemArgs = {
  data: CreateRejectedCorpusItemInput;
};

export type MutationCreateScheduleReviewArgs = {
  data: CreateScheduleReviewInput;
};

export type MutationCreateScheduledCorpusItemArgs = {
  data: CreateScheduledCorpusItemInput;
};

export type MutationCreateSectionItemArgs = {
  data: CreateSectionItemInput;
};

export type MutationDeleteCollectionPartnerAssociationArgs = {
  externalId: Scalars['String'];
};

export type MutationDeleteCollectionStoryArgs = {
  externalId: Scalars['String'];
};

export type MutationDeleteCustomSectionArgs = {
  externalId: Scalars['ID'];
};

export type MutationDeleteScheduledCorpusItemArgs = {
  data: DeleteScheduledCorpusItemInput;
};

export type MutationDisableEnableSectionArgs = {
  data: DisableEnableSectionInput;
};

export type MutationModerateShareableListArgs = {
  data: ModerateShareableListInput;
};

export type MutationRefreshItemArticleArgs = {
  url: Scalars['String'];
};

export type MutationRejectApprovedCorpusItemArgs = {
  data: RejectApprovedCorpusItemInput;
};

export type MutationRemoveProspectArgs = {
  data: RemoveProspectInput;
};

export type MutationRemoveSectionItemArgs = {
  data: RemoveSectionItemInput;
};

export type MutationRescheduleScheduledCorpusItemArgs = {
  data: RescheduleScheduledCorpusItemInput;
};

export type MutationUpdateApprovedCorpusItemArgs = {
  data: UpdateApprovedCorpusItemInput;
};

export type MutationUpdateCollectionArgs = {
  data: UpdateCollectionInput;
};

export type MutationUpdateCollectionAuthorArgs = {
  data: UpdateCollectionAuthorInput;
};

export type MutationUpdateCollectionAuthorImageUrlArgs = {
  data: UpdateCollectionAuthorImageUrlInput;
};

export type MutationUpdateCollectionImageUrlArgs = {
  data: UpdateCollectionImageUrlInput;
};

export type MutationUpdateCollectionPartnerArgs = {
  data: UpdateCollectionPartnerInput;
};

export type MutationUpdateCollectionPartnerAssociationArgs = {
  data: UpdateCollectionPartnerAssociationInput;
};

export type MutationUpdateCollectionPartnerAssociationImageUrlArgs = {
  data: UpdateCollectionPartnerAssociationImageUrlInput;
};

export type MutationUpdateCollectionPartnerImageUrlArgs = {
  data: UpdateCollectionPartnerImageUrlInput;
};

export type MutationUpdateCollectionStoryArgs = {
  data: UpdateCollectionStoryInput;
};

export type MutationUpdateCollectionStoryImageUrlArgs = {
  data: UpdateCollectionStoryImageUrlInput;
};

export type MutationUpdateCollectionStorySortOrderArgs = {
  data: UpdateCollectionStorySortOrderInput;
};

export type MutationUpdateCustomSectionArgs = {
  data: UpdateCustomSectionInput;
};

export type MutationUpdateLabelArgs = {
  data: UpdateLabelInput;
};

export type MutationUpdateProspectAsCuratedArgs = {
  id: Scalars['ID'];
};

export type MutationUploadApprovedCorpusItemImageArgs = {
  data: Scalars['Upload'];
};

export type NumberedListElement = ListElement & {
  __typename?: 'NumberedListElement';
  /** Row in a list */
  content: Scalars['Markdown'];
  /** Numeric index. If a nested item, the index is zero-indexed from the first child. */
  index: Scalars['Int'];
  /** Zero-indexed level, for handling nested lists. */
  level: Scalars['Int'];
};

export type OEmbed = PocketMetadata & {
  __typename?: 'OEmbed';
  authors?: Maybe<Array<Author>>;
  datePublished?: Maybe<Scalars['ISOString']>;
  domain?: Maybe<DomainMetadata>;
  excerpt?: Maybe<Scalars['String']>;
  htmlEmbed?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  image?: Maybe<Image>;
  item?: Maybe<Item>;
  source: PocketMetadataSource;
  title?: Maybe<Scalars['String']>;
  type?: Maybe<OEmbedType>;
  url: Scalars['Url'];
};

export enum OEmbedType {
  Link = 'LINK',
  Photo = 'PHOTO',
  Rich = 'RICH',
  Video = 'VIDEO',
}

export type OpenGraphFields = {
  __typename?: 'OpenGraphFields';
  description: Scalars['String'];
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

export type Pagination = {
  __typename?: 'Pagination';
  currentPage: Scalars['Int'];
  perPage: Scalars['Int'];
  totalPages: Scalars['Int'];
  totalResults: Scalars['Int'];
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

export type PocketMetadata = {
  authors?: Maybe<Array<Author>>;
  datePublished?: Maybe<Scalars['ISOString']>;
  domain?: Maybe<DomainMetadata>;
  excerpt?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  image?: Maybe<Image>;
  item?: Maybe<Item>;
  source: PocketMetadataSource;
  title?: Maybe<Scalars['String']>;
  url: Scalars['Url'];
};

export enum PocketMetadataSource {
  Oembed = 'OEMBED',
  Opengraph = 'OPENGRAPH',
  PocketParser = 'POCKET_PARSER',
}

export type PocketShare = {
  __typename?: 'PocketShare';
  preview?: Maybe<PocketMetadata>;
  targetUrl: Scalars['ValidUrl'];
};

export type Prospect = {
  __typename?: 'Prospect';
  approvedCorpusItem?: Maybe<ApprovedCorpusItem>;
  authors?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['Int']>;
  domain?: Maybe<Scalars['String']>;
  excerpt?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  imageUrl?: Maybe<Scalars['String']>;
  isCollection?: Maybe<Scalars['Boolean']>;
  isSyndicated?: Maybe<Scalars['Boolean']>;
  item?: Maybe<Item>;
  language?: Maybe<CorpusLanguage>;
  prospectId: Scalars['ID'];
  prospectType: Scalars['String'];
  publisher?: Maybe<Scalars['String']>;
  rejectedCorpusItem?: Maybe<RejectedCorpusItem>;
  saveCount?: Maybe<Scalars['Int']>;
  scheduledSurfaceGuid: Scalars['String'];
  title?: Maybe<Scalars['String']>;
  topic?: Maybe<Scalars['String']>;
  url: Scalars['String'];
};

/**
 * Prospect types. This enum is not used anywhere in this schema, however it is used
 * by the Curation Admin Tools frontend to filter prospects.
 */
export enum ProspectType {
  Counts = 'COUNTS',
  Dismissed = 'DISMISSED',
  DomainAllowlist = 'DOMAIN_ALLOWLIST',
  PublisherSubmitted = 'PUBLISHER_SUBMITTED',
  QaBooks = 'QA_BOOKS',
  QaCelebrity = 'QA_CELEBRITY',
  QaEntertainment = 'QA_ENTERTAINMENT',
  QaMlb = 'QA_MLB',
  QaMovies = 'QA_MOVIES',
  QaMusic = 'QA_MUSIC',
  QaNba = 'QA_NBA',
  QaNfl = 'QA_NFL',
  QaNhl = 'QA_NHL',
  QaSoccer = 'QA_SOCCER',
  QaSports = 'QA_SPORTS',
  QaTelevision = 'QA_TELEVISION',
  Recommended = 'RECOMMENDED',
  RssLogistic = 'RSS_LOGISTIC',
  RssLogisticRecent = 'RSS_LOGISTIC_RECENT',
  SlateSchedulerV2 = 'SLATE_SCHEDULER_V2',
  Timespent = 'TIMESPENT',
  TitleUrlModeled = 'TITLE_URL_MODELED',
  TopSaved = 'TOP_SAVED',
}

export type Query = {
  __typename?: 'Query';
  /** Retrieves an approved item with the given external ID. */
  approvedCorpusItemByExternalId?: Maybe<ApprovedCorpusItem>;
  /** Retrieves an approved item with the given URL. */
  getApprovedCorpusItemByUrl?: Maybe<ApprovedCorpusItem>;
  /** Retrieves a paginated, filterable list of Approved Items. */
  getApprovedCorpusItems: ApprovedCorpusItemConnection;
  /** Retrieves a Collection by externalId. */
  getCollection?: Maybe<Collection>;
  /** Retrieves a CollectionAuthor by externalId. */
  getCollectionAuthor?: Maybe<CollectionAuthor>;
  /** Retrieves a paged list of CollectionAuthors. */
  getCollectionAuthors: CollectionAuthorsResult;
  /** Retrieves a CollectionAuthor by externalId. */
  getCollectionPartner?: Maybe<CollectionPartner>;
  /** Retrieves a CollectionPartnerAssociation by externalId. Used for tests only. */
  getCollectionPartnerAssociation?: Maybe<CollectionPartnerAssociation>;
  /**
   * Retrieves a CollectionPartnerAssociation by the externalId of the collection
   * it is related to.
   */
  getCollectionPartnerAssociationForCollection?: Maybe<CollectionPartnerAssociation>;
  /** Retrieves a paged list of CollectionAuthors. */
  getCollectionPartners: CollectionPartnersResult;
  /** Retrieves a CollectionStory by externalId. Used for tests only. */
  getCollectionStory?: Maybe<CollectionStory>;
  /** Retrieves a list of CurationCategories, sorted alphabetically */
  getCurationCategories: Array<CurationCategory>;
  /** Retrieves the nested list of IAB top/sub categories. */
  getIABCategories: Array<IabParentCategory>;
  /**
   * Look up Item info by a url.
   * @deprecated Use itemByUrl instead
   */
  getItemByUrl?: Maybe<Item>;
  /** Retrieves the languages currently supported. */
  getLanguages: Array<CollectionLanguage>;
  /** Tool to get OG description of URL that is not yet implemented in parser */
  getOpenGraphFields?: Maybe<OpenGraphFields>;
  /** returns a set of at most 20 prospects (number may be smaller depending on available data) */
  getProspects: Array<Prospect>;
  /** Retrieves a paginated, filterable list of Rejected Items. */
  getRejectedCorpusItems: RejectedCorpusItemConnection;
  /** Retrieves a list of Approved Items that are scheduled to appear on a Scheduled Surface. */
  getScheduledCorpusItems: Array<ScheduledCorpusItemsResult>;
  /** Retrieves all ScheduledSurfaces available to the given SSO user. Requires an Authorization header. */
  getScheduledSurfacesForUser: Array<ScheduledSurface>;
  /** Retrieves a list of active and enabled/disabled Sections with their corresponding active SectionItems for a scheduled surface. */
  getSectionsWithSectionItems: Array<Section>;
  /** returns parser meta data for a given url */
  getUrlMetadata: UrlMetadata;
  /** Look up Item info by a url. */
  itemByUrl?: Maybe<Item>;
  /** Retrieves all available Labels */
  labels: Array<Label>;
  /**
   * Resolve Reader View links which might point to SavedItems that do not
   * exist, aren't in the Pocket User's list, or are requested by a logged-out
   * user (or user without a Pocket Account).
   * Fetches data which clients can use to generate an appropriate fallback view
   * that allows users to preview the content and access the original source site.
   */
  readerSlug: ReaderViewResult;
  searchCollections: CollectionsResult;
  /** Looks up and returns a Shareable List with a given external ID for any user. */
  searchShareableList?: Maybe<ShareableListComplete>;
};

export type QueryApprovedCorpusItemByExternalIdArgs = {
  externalId: Scalars['ID'];
};

export type QueryGetApprovedCorpusItemByUrlArgs = {
  url: Scalars['String'];
};

export type QueryGetApprovedCorpusItemsArgs = {
  filters?: InputMaybe<ApprovedCorpusItemFilter>;
  pagination?: InputMaybe<PaginationInput>;
};

export type QueryGetCollectionArgs = {
  externalId: Scalars['String'];
};

export type QueryGetCollectionAuthorArgs = {
  externalId: Scalars['String'];
};

export type QueryGetCollectionAuthorsArgs = {
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
};

export type QueryGetCollectionPartnerArgs = {
  externalId: Scalars['String'];
};

export type QueryGetCollectionPartnerAssociationArgs = {
  externalId: Scalars['String'];
};

export type QueryGetCollectionPartnerAssociationForCollectionArgs = {
  externalId: Scalars['String'];
};

export type QueryGetCollectionPartnersArgs = {
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
};

export type QueryGetCollectionStoryArgs = {
  externalId: Scalars['String'];
};

export type QueryGetItemByUrlArgs = {
  url: Scalars['String'];
};

export type QueryGetOpenGraphFieldsArgs = {
  url: Scalars['Url'];
};

export type QueryGetProspectsArgs = {
  filters: GetProspectsFilters;
};

export type QueryGetRejectedCorpusItemsArgs = {
  filters?: InputMaybe<RejectedCorpusItemFilter>;
  pagination?: InputMaybe<PaginationInput>;
};

export type QueryGetScheduledCorpusItemsArgs = {
  filters: ScheduledCorpusItemsFilterInput;
};

export type QueryGetSectionsWithSectionItemsArgs = {
  createSource?: InputMaybe<ActivitySource>;
  scheduledSurfaceGuid: Scalars['ID'];
};

export type QueryGetUrlMetadataArgs = {
  url: Scalars['String'];
};

export type QueryItemByUrlArgs = {
  url: Scalars['String'];
};

export type QueryReaderSlugArgs = {
  slug: Scalars['ID'];
};

export type QuerySearchCollectionsArgs = {
  filters: SearchCollectionsFilters;
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
};

export type QuerySearchShareableListArgs = {
  externalId: Scalars['ID'];
};

/**
 * Metadata of an Item in Pocket for preview purposes,
 * or an ItemNotFound result if the record does not exist.
 */
export type ReaderFallback = ItemNotFound | ReaderInterstitial;

/**
 * Card preview data for Items resolved from reader view
 * (getpocket.com/read/) links.
 *
 * Should be used to create a view if Reader Mode cannot
 * be rendered (e.g. the link is visited by an anonymous
 * Pocket user, or a Pocket User that does not have the
 * underlying Item in their Saves). Due to legal obligations
 * we can only display Reader Mode for SavedItems.
 */
export type ReaderInterstitial = {
  __typename?: 'ReaderInterstitial';
  itemCard?: Maybe<PocketMetadata>;
};

/** Result for resolving a getpocket.com/read/<slug> link. */
export type ReaderViewResult = {
  __typename?: 'ReaderViewResult';
  fallbackPage?: Maybe<ReaderFallback>;
  slug: Scalars['ID'];
};

/** Input data for rejecting an Approved Item. */
export type RejectApprovedCorpusItemInput = {
  /**
   * The UI screen where the approved corpus item is being rejected from.
   * Can be the schedule screen or the corpus screen.
   */
  actionScreen?: InputMaybe<ActionScreen>;
  /** Approved Item ID. */
  externalId: Scalars['ID'];
  /** A comma-separated list of rejection reasons. */
  reason: Scalars['String'];
};

/** A prospective story that has been rejected by the curators. */
export type RejectedCorpusItem = {
  __typename?: 'RejectedCorpusItem';
  /** A Unix timestamp of when the entity was created. */
  createdAt: Scalars['Int'];
  /** A single sign-on user identifier of the user who created this entity. */
  createdBy: Scalars['String'];
  /** An alternative primary key in UUID format that is generated on creation. */
  externalId: Scalars['ID'];
  /** What language this story is in. This is a two-letter code, for example, 'EN' for English. */
  language?: Maybe<CorpusLanguage>;
  /** The GUID of the corresponding Prospect ID. Will be empty if the item was manually added. */
  prospectId?: Maybe<Scalars['ID']>;
  /** The name of the online publication that published this story. */
  publisher?: Maybe<Scalars['String']>;
  /** Reason why it was rejected. Can be multiple reasons. Will likely be stored either as comma-separated values or JSON. */
  reason: Scalars['String'];
  /** The title of the story. */
  title?: Maybe<Scalars['String']>;
  /**
   * A topic this story best fits in.
   * Temporarily a string value that will be provided by Prospect API, possibly an enum in the future.
   */
  topic?: Maybe<Scalars['String']>;
  /** The URL of the story. */
  url: Scalars['Url'];
};

/** The connection type for Rejected Item. */
export type RejectedCorpusItemConnection = {
  __typename?: 'RejectedCorpusItemConnection';
  /** A list of edges. */
  edges: Array<RejectedCorpusItemEdge>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** Identifies the total count of Rejected Curated Items in the connection. */
  totalCount: Scalars['Int'];
};

/** An edge in a connection for RejectedCorpusItem type. */
export type RejectedCorpusItemEdge = {
  __typename?: 'RejectedCorpusItemEdge';
  /** A cursor for use in pagination. */
  cursor: Scalars['String'];
  /** The Rejected Item at the end of the edge. */
  node: RejectedCorpusItem;
};

/** Available fields for filtering Rejected Items. */
export type RejectedCorpusItemFilter = {
  /**
   * Optional filter on the language Rejected Curated Items have been classified as.
   * This is a two-letter string, e.g. 'EN' for English or 'DE' for 'German'.
   */
  language?: InputMaybe<CorpusLanguage>;
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
  Commercial = 'COMMERCIAL',
  Misinformation = 'MISINFORMATION',
  OffensiveMaterial = 'OFFENSIVE_MATERIAL',
  Other = 'OTHER',
  Paywall = 'PAYWALL',
  PoliticalOpinion = 'POLITICAL_OPINION',
  PublisherQuality = 'PUBLISHER_QUALITY',
  PublisherRequest = 'PUBLISHER_REQUEST',
  TimeSensitive = 'TIME_SENSITIVE',
}

/**
 * 2024-01-29
 *
 * these reasons are used when dismissing prospects only for the
 * SLATE_SCHEDULE_V2 prospect type. this is a preliminary step towards ML
 * scheduling items, and this reason set will *likely* be used when removing ML
 * scheduled items as well.
 *
 * these reasons *may* also be used more widely in the prospecting view in the
 * future, but would be blocked on removal count going down significantly.
 *
 * As of today, 2024-01-29, these reasons have been finalized.
 * 1.31.2024 - Reasons have been modified (https://docs.google.com/spreadsheets/d/1HWLpoiKh-CPXkMKrfHKBSohrR8C8o0StcMucF0C0vEk)
 */
export enum RemovalReason {
  ArticleQuality = 'ARTICLE_QUALITY',
  Commercial = 'COMMERCIAL',
  Controversial = 'CONTROVERSIAL',
  HedDekQuality = 'HED_DEK_QUALITY',
  ImageQuality = 'IMAGE_QUALITY',
  Niche = 'NICHE',
  NoImage = 'NO_IMAGE',
  OneSided = 'ONE_SIDED',
  Partisan = 'PARTISAN',
  Paywall = 'PAYWALL',
  PublisherDiversity = 'PUBLISHER_DIVERSITY',
  PublisherQuality = 'PUBLISHER_QUALITY',
  PublishDate = 'PUBLISH_DATE',
  SetDiversity = 'SET_DIVERSITY',
  TimeSensitive = 'TIME_SENSITIVE',
  TopicDiversity = 'TOPIC_DIVERSITY',
}

/** Input data for removing a prospect. */
export type RemoveProspectInput = {
  /** The GUID of the corresponding Prospect. */
  id: Scalars['ID'];
  /** Free-text entered by the curator to give further detail to the reason(s) provided. */
  reasonComment?: InputMaybe<Scalars['String']>;
  /** A comma-separated list of removal reasons. */
  reasons?: InputMaybe<Scalars['String']>;
};

/** Input data for removing a SectionItem */
export type RemoveSectionItemInput = {
  /** Array of reasons for removing a SectionItem. */
  deactivateReasons: Array<SectionItemRemovalReason>;
  /**
   * Indicates which source deactivated the SectionItem.
   * Optional; MANUAL if omitted
   */
  deactivateSource?: InputMaybe<ActivitySource>;
  /** ID of the SectionItem. A string in UUID format. */
  externalId: Scalars['ID'];
};

/** Input data for rescheduling a scheduled item for a Scheduled Surface. */
export type RescheduleScheduledCorpusItemInput = {
  /**
   * The UI screen where the scheduled corpus item is being resceduled from.
   * Can only be from the schedule screen.
   */
  actionScreen?: InputMaybe<ActionScreen>;
  /** ID of the scheduled item. A string in UUID format. */
  externalId: Scalars['ID'];
  /** The new scheduled date for the scheduled item to appear on a Scheduled Surface. Format: YYYY-MM-DD. */
  scheduledDate: Scalars['Date'];
  /** Source of the Scheduled Item. Could be one of: MANUAL or ML */
  source: ActivitySource;
};

/** Contains information about the human curator who reviewed the schedule for a given date and scheduled surface. */
export type ScheduleReview = {
  __typename?: 'ScheduleReview';
  /** A Unix timestamp of when the scheduled was last reviewed. */
  reviewedAt: Scalars['Date'];
  /** A single sign-on user identifier of the user who reviewed the schedule. */
  reviewedBy: Scalars['String'];
  /** The date of the schedule that was reviewed, in YYYY-MM-DD format. */
  scheduledDate: Scalars['Date'];
  /** The GUID of the scheduledSurface that was reviewed. */
  scheduledSurfaceGuid: Scalars['ID'];
};

/**
 * A scheduled entry for an Approved Item to appear on a Scheduled Surface.
 * For example, a story that is scheduled to appear on December 31st, 2021 on the New Tab in Firefox for the US audience.
 */
export type ScheduledCorpusItem = {
  __typename?: 'ScheduledCorpusItem';
  /** The associated Approved Item. */
  approvedItem: ApprovedCorpusItem;
  /** A Unix timestamp of when the entity was created. */
  createdAt: Scalars['Int'];
  /** A single sign-on user identifier of the user who created this entity. */
  createdBy: Scalars['String'];
  /** An alternative primary key in UUID format that is generated on creation. */
  externalId: Scalars['ID'];
  /**
   * The date the associated Approved Item is scheduled to appear on a Scheduled Surface.
   * This date is relative to the time zone of the Scheduled Surface. Format: YYYY-MM-DD.
   */
  scheduledDate: Scalars['Date'];
  /** The GUID of this scheduledSurface to which this item is scheduled. Example: 'NEW_TAB_EN_US'. */
  scheduledSurfaceGuid: Scalars['ID'];
  /** Source of the Scheduled Item. Could be one of: MANUAL or ML */
  source: ActivitySource;
  /** A Unix timestamp of when the entity was last updated. */
  updatedAt: Scalars['Int'];
  /** A single sign-on user identifier of the user who last updated this entity. Null on creation. */
  updatedBy?: Maybe<Scalars['String']>;
};

/** Available fields for filtering scheduled items for a given Scheduled Surface. */
export type ScheduledCorpusItemsFilterInput = {
  /** To what day to show scheduled items to, inclusive. Expects a date in YYYY-MM-DD format. */
  endDate: Scalars['Date'];
  /** The GUID of the Scheduled Surface. Example: 'NEW_TAB_EN_US'. */
  scheduledSurfaceGuid: Scalars['ID'];
  /** Which day to show scheduled items from. Expects a date in YYYY-MM-DD format. */
  startDate: Scalars['Date'];
};

/** The shape of the result returned by the getScheduledCorpusItems query. */
export type ScheduledCorpusItemsResult = {
  __typename?: 'ScheduledCorpusItemsResult';
  /** The number of curated items that are collections for the scheduled date. */
  collectionCount: Scalars['Int'];
  /** An array of items for a given Scheduled Surface */
  items: Array<ScheduledCorpusItem>;
  /** The human review status of the schedule for the given scheduledSurfaceGuid & scheduledDate. */
  scheduleReview?: Maybe<ScheduleReview>;
  /** The date items are scheduled for, in YYYY-MM-DD format. */
  scheduledDate: Scalars['Date'];
  /** The number of syndicated articles for the scheduled date. */
  syndicatedCount: Scalars['Int'];
  /** The total number of items for the scheduled date. */
  totalCount: Scalars['Int'];
};

/** A Scheduled Surface, including its associated Prospect Types. */
export type ScheduledSurface = {
  __typename?: 'ScheduledSurface';
  /** The GUID of the Scheduled Surface. Example: 'NEW_TAB_EN_US'. */
  guid: Scalars['String'];
  /** The IANA timezone of the Scheduled Surface, used to determine the start of a day. */
  ianaTimezone: Scalars['String'];
  /** The display name of the Scheduled Surface. Example 'New Tab (en-US)'. */
  name: Scalars['String'];
  /** An array of associated ProspectTypes. */
  prospectTypes: Array<ProspectType>;
};

/** available filters for searching collections */
export type SearchCollectionsFilters = {
  author?: InputMaybe<Scalars['String']>;
  labelExternalIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  status?: InputMaybe<CollectionStatus>;
  title?: InputMaybe<Scalars['String']>;
};

/** An entity containing Corpus Items. */
export type Section = {
  __typename?: 'Section';
  /** Indicates whether or not a Section is available for display. */
  active: Scalars['Boolean'];
  /** The source which created the Section. */
  createSource: ActivitySource;
  /** A Unix timestamp of when the Section was created. */
  createdAt: Scalars['Int'];
  /** A short description of the Section. */
  description?: Maybe<Scalars['String']>;
  /**
   * Indicates whether or not a Section is fully disabled from display on NewTab. Can only  be controlled
   * in the admin tool.
   */
  disabled: Scalars['Boolean'];
  /**
   * An optional date of when the Section should stop being displayed.
   * Format: YYYY-MM-DD.
   */
  endDate?: Maybe<Scalars['Date']>;
  /** An alternative primary key in UUID format. */
  externalId: Scalars['ID'];
  /**
   * An optional description or supporting text for use in hero modules.
   * Relevant for custom sections.
   */
  heroDescription?: Maybe<Scalars['String']>;
  /** An optional title used in hero modules. Relevant for custom sections. */
  heroTitle?: Maybe<Scalars['String']>;
  /** Optional IAB metadata returned to the client (i.e. Merino->Firefox, Admin Tools) */
  iab?: Maybe<IabMetadata>;
  /** The GUID of the Scheduled Surface. Example: 'NEW_TAB_EN_US'. */
  scheduledSurfaceGuid: Scalars['ID'];
  /**
   * An array of active and in-active SectionItems in a Section.
   * This field returns an empty array when creating a new Section or updating a Section.
   */
  sectionItems: Array<SectionItem>;
  /** Controls the display order of Sections. */
  sort?: Maybe<Scalars['Int']>;
  /**
   * The date when the Section becomes eligible for display.
   * Format: YYYY-MM-DD.
   */
  startDate?: Maybe<Scalars['Date']>;
  /** Computed status for the Section, based on startDate, endDate, and disabled. */
  status: SectionStatus;
  /** The title of the Section displayed to the users. */
  title: Scalars['String'];
  /** A Unix timestamp of when the Section was last updated. */
  updatedAt: Scalars['Int'];
};

/** Available fields for filtering Sections. */
export type SectionFilters = {
  /** Required filter to retrieve Sections & SectionItems for a Scheduled Surface */
  scheduledSurfaceGuid: Scalars['ID'];
};

/** A CorpusItem belonging to a Section */
export type SectionItem = {
  __typename?: 'SectionItem';
  /** The associated Approved Corpus Item. */
  approvedItem: ApprovedCorpusItem;
  /** A Unix timestamp of when the entity was created. */
  createdAt: Scalars['Int'];
  /** An alternative primary key in UUID format that is generated on creation. */
  externalId: Scalars['ID'];
  /**
   * The initial rank of the SectionItem in relation to its siblings. Used as a
   * fallback in Merino when there is no engagement/click data available. May only apply to
   * ML-generated SectionItems.
   */
  rank?: Maybe<Scalars['Int']>;
  /** A Unix timestamp of when the entity was last updated. */
  updatedAt: Scalars['Int'];
};

/**
 * Reasons for removing SectionItems from ML Sections.
 *
 * This is used by ML downstream to improve their modeling.
 */
export enum SectionItemRemovalReason {
  ArticleQuality = 'ARTICLE_QUALITY',
  Controversial = 'CONTROVERSIAL',
  Dated = 'DATED',
  HedDekQuality = 'HED_DEK_QUALITY',
  ImageQuality = 'IMAGE_QUALITY',
  Ml = 'ML',
  NoImage = 'NO_IMAGE',
  OffTopic = 'OFF_TOPIC',
  OneSided = 'ONE_SIDED',
  Other = 'OTHER',
  Paywall = 'PAYWALL',
  PublisherQuality = 'PUBLISHER_QUALITY',
  SetDiversity = 'SET_DIVERSITY',
}

/** Represents the current Section status, computed dynamically. */
export enum SectionStatus {
  Disabled = 'DISABLED',
  Expired = 'EXPIRED',
  Live = 'LIVE',
  Scheduled = 'SCHEDULED',
}

export type ShareableListComplete = {
  __typename?: 'ShareableListComplete';
  /** The timestamp of when the list was created by its owner. */
  createdAt: Scalars['ISOString'];
  /** Optional text description of a Shareable List. Provided by the Pocket user. */
  description?: Maybe<Scalars['String']>;
  /** A unique string identifier in UUID format. */
  externalId: Scalars['ID'];
  /** The visibility of notes added to list items for this list. */
  listItemNoteVisibility: ShareableListVisibility;
  /** Pocket Saves that have been added to this list by the Pocket user. */
  listItems: Array<ShareableListItem>;
  /**
   * The LDAP username of the moderator who took down a list
   * that violates the Pocket content moderation policy.
   */
  moderatedBy?: Maybe<Scalars['String']>;
  /** The optional details why the list was moderated. */
  moderationDetails?: Maybe<Scalars['String']>;
  /** The reason why the moderator took down the list. */
  moderationReason?: Maybe<ShareableListModerationReason>;
  /** The moderation status of the list. Defaults to VISIBLE. */
  moderationStatus: ShareableListModerationStatus;
  /** The reason why a list was restored (set from hidden to visible). */
  restorationReason?: Maybe<Scalars['String']>;
  /**
   * A URL-ready identifier of the list. Generated from the title
   * of the list when it's first made public. Unique per user.
   */
  slug?: Maybe<Scalars['String']>;
  /** The status of the list. Defaults to PRIVATE. */
  status: ShareableListVisibility;
  /** The title of the list. Provided by the Pocket user. */
  title: Scalars['String'];
  /**
   * The timestamp of when the list was last updated by its owner
   * or a member of the moderation team.
   */
  updatedAt: Scalars['ISOString'];
  /** The user who created this shareable list. */
  user: User;
};

/** A Pocket Save (story) that has been added to a Shareable List. */
export type ShareableListItem = {
  __typename?: 'ShareableListItem';
  /** A comma-separated list of story authors. Supplied by the Parser. */
  authors?: Maybe<Scalars['String']>;
  /** The timestamp of when this story was added to the list by its owner. */
  createdAt: Scalars['ISOString'];
  /** The excerpt of the story. Supplied by the Parser. */
  excerpt?: Maybe<Scalars['String']>;
  /** A unique string identifier in UUID format. */
  externalId: Scalars['ID'];
  /** The URL of the thumbnail image illustrating the story. Supplied by the Parser. */
  imageUrl?: Maybe<Scalars['Url']>;
  /** The Parser Item ID. */
  itemId: Scalars['ID'];
  /** User generated note to accompany this list item. */
  note?: Maybe<Scalars['String']>;
  /** The name of the publisher for this story. Supplied by the Parser. */
  publisher?: Maybe<Scalars['String']>;
  /** The custom sort order of stories within a list. Defaults to 1. */
  sortOrder: Scalars['Int'];
  /**
   * The title of the story. Supplied by the Parser.
   * May not be available for URLs that cannot be resolved.
   * Not editable by the Pocket user, as are all the other
   * Parser-supplied story properties below.
   */
  title?: Maybe<Scalars['String']>;
  /** The timestamp of when the story was last updated. Not used for the MVP. */
  updatedAt: Scalars['ISOString'];
  /** The URL of the story saved to a list. */
  url: Scalars['Url'];
};

export enum ShareableListModerationReason {
  AbusiveBehavior = 'ABUSIVE_BEHAVIOR',
  AdultSexualContent = 'ADULT_SEXUAL_CONTENT',
  Copyright = 'COPYRIGHT',
  Counterfeit = 'COUNTERFEIT',
  CsamImages = 'CSAM_IMAGES',
  CsamSolicitation = 'CSAM_SOLICITATION',
  Fraud = 'FRAUD',
  HateSpeech = 'HATE_SPEECH',
  IllegalGoodsAndServices = 'ILLEGAL_GOODS_AND_SERVICES',
  IncitementToViolence = 'INCITEMENT_TO_VIOLENCE',
  InstructionsForViolence = 'INSTRUCTIONS_FOR_VIOLENCE',
  Malware = 'MALWARE',
  MisleadingInformation = 'MISLEADING_INFORMATION',
  Phishing = 'PHISHING',
  PostingPrivateInformation = 'POSTING_PRIVATE_INFORMATION',
  SelfHarm = 'SELF_HARM',
  Spam = 'SPAM',
  Terrorism = 'TERRORISM',
  Trademark = 'TRADEMARK',
  ViolenceAndGore = 'VIOLENCE_AND_GORE',
}

/** The moderation status of a Shareable List. Defaults to VISIBLE. */
export enum ShareableListModerationStatus {
  /**
   * The list and its contents have been removed from view and further editing
   * by its owner as it violated the Pocket content moderation policy.
   */
  Hidden = 'HIDDEN',
  /** The list and its contents abide by the Pocket content moderation policy. */
  Visible = 'VISIBLE',
}

/** The visibility levels used (e.g. list, list item note) in the Shareable List API. Defaults to PRIVATE - visible only to its owner. */
export enum ShareableListVisibility {
  /** Only visible to its owner - the Pocket user who created it. */
  Private = 'PRIVATE',
  /** Can be viewed by anyone in the world. */
  Public = 'PUBLIC',
}

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
  Home = 'HOME',
  Parenting = 'PARENTING',
  PersonalFinance = 'PERSONAL_FINANCE',
  Politics = 'POLITICS',
  Science = 'SCIENCE',
  SelfImprovement = 'SELF_IMPROVEMENT',
  Sports = 'SPORTS',
  Technology = 'TECHNOLOGY',
  Travel = 'TRAVEL',
}

/** Represents content that could not be parsed into a valid Marticle* component. */
export type UnMarseable = {
  __typename?: 'UnMarseable';
  /** The html that could not be parsed into a Marticle* component. */
  html: Scalars['String'];
};

/** Input data for updating an Approved Item. */
export type UpdateApprovedCorpusItemInput = {
  /**
   * The UI screen where the approved corpus item is being updated from.
   * Can be on the corpus screen or the schedule screen.
   */
  actionScreen?: InputMaybe<ActionScreen>;
  /** A name and sort order for each author. */
  authors: Array<CorpusItemAuthorInput>;
  /** The publication date for this story. */
  datePublished?: InputMaybe<Scalars['Date']>;
  /** The excerpt of the Approved Item. */
  excerpt: Scalars['String'];
  /** Approved Item ID. */
  externalId: Scalars['ID'];
  /** The image URL for this item's accompanying picture. */
  imageUrl: Scalars['Url'];
  /**
   * A flag to ML to not recommend this item long term after it is added to the corpus.
   * Example: a story covering an election, or "The best of 202x" collection.
   */
  isTimeSensitive: Scalars['Boolean'];
  /** What language this item is in. This is a two-letter code, for example, 'EN' for English. */
  language: CorpusLanguage;
  /** The name of the online publication that published this story. */
  publisher: Scalars['String'];
  /** The outcome of the curators' review of the Approved Item. */
  status: CuratedStatus;
  /** The title of the Approved Item. */
  title: Scalars['String'];
  /** A topic this story best fits in. */
  topic: Scalars['String'];
};

export type UpdateCollectionAuthorImageUrlInput = {
  externalId: Scalars['String'];
  imageUrl: Scalars['Url'];
};

export type UpdateCollectionAuthorInput = {
  active?: InputMaybe<Scalars['Boolean']>;
  bio?: InputMaybe<Scalars['Markdown']>;
  externalId: Scalars['String'];
  imageUrl?: InputMaybe<Scalars['Url']>;
  name: Scalars['String'];
  slug: Scalars['String'];
};

export type UpdateCollectionImageUrlInput = {
  externalId: Scalars['String'];
  imageUrl: Scalars['Url'];
};

export type UpdateCollectionInput = {
  IABChildCategoryExternalId?: InputMaybe<Scalars['String']>;
  IABParentCategoryExternalId?: InputMaybe<Scalars['String']>;
  authorExternalId: Scalars['String'];
  curationCategoryExternalId?: InputMaybe<Scalars['String']>;
  excerpt: Scalars['Markdown'];
  externalId?: InputMaybe<Scalars['String']>;
  imageUrl?: InputMaybe<Scalars['Url']>;
  intro?: InputMaybe<Scalars['Markdown']>;
  labelExternalIds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  language: CollectionLanguage;
  slug: Scalars['String'];
  status: CollectionStatus;
  title: Scalars['String'];
};

export type UpdateCollectionPartnerAssociationImageUrlInput = {
  externalId: Scalars['String'];
  imageUrl: Scalars['Url'];
};

export type UpdateCollectionPartnerAssociationInput = {
  blurb?: InputMaybe<Scalars['Markdown']>;
  externalId: Scalars['String'];
  imageUrl?: InputMaybe<Scalars['Url']>;
  name?: InputMaybe<Scalars['String']>;
  partnerExternalId: Scalars['String'];
  type: CollectionPartnershipType;
  url?: InputMaybe<Scalars['Url']>;
};

export type UpdateCollectionPartnerImageUrlInput = {
  externalId: Scalars['String'];
  imageUrl: Scalars['Url'];
};

export type UpdateCollectionPartnerInput = {
  blurb: Scalars['Markdown'];
  externalId: Scalars['String'];
  imageUrl?: InputMaybe<Scalars['Url']>;
  name: Scalars['String'];
  url: Scalars['Url'];
};

export type UpdateCollectionStoryImageUrlInput = {
  externalId: Scalars['String'];
  imageUrl: Scalars['Url'];
};

export type UpdateCollectionStoryInput = {
  authors: Array<CollectionStoryAuthorInput>;
  excerpt: Scalars['Markdown'];
  externalId: Scalars['String'];
  fromPartner?: InputMaybe<Scalars['Boolean']>;
  imageUrl: Scalars['Url'];
  publisher: Scalars['String'];
  sortOrder?: InputMaybe<Scalars['Int']>;
  title: Scalars['String'];
  url: Scalars['Url'];
};

export type UpdateCollectionStorySortOrderInput = {
  externalId: Scalars['String'];
  sortOrder: Scalars['Int'];
};

/** Input data for updating a Custom Editorial Section */
export type UpdateCustomSectionInput = {
  /** The description of the custom section displayed to the users. */
  description: Scalars['String'];
  /** An optional date of when the Section should stop being displayed. */
  endDate?: InputMaybe<Scalars['Date']>;
  /** An alternative primary key in UUID format supplied by ML. */
  externalId: Scalars['ID'];
  /** An optional description or supporting text for use in hero modules. */
  heroDescription?: InputMaybe<Scalars['String']>;
  /** An optional title used in hero modules. */
  heroTitle?: InputMaybe<Scalars['String']>;
  /** Optional IAB metadata input */
  iab?: InputMaybe<IabMetadataInput>;
  /** Controls the display order of Sections. */
  sort?: InputMaybe<Scalars['Int']>;
  /** The date of when the Section should go "live" for display on NewTab. */
  startDate: Scalars['Date'];
  /** The title of the custom section displayed to the users. */
  title: Scalars['String'];
  /** The source which updated the Section. */
  updateSource: ActivitySource;
};

export type UpdateLabelInput = {
  externalId?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
};

export type UrlMetadata = {
  __typename?: 'UrlMetadata';
  authors?: Maybe<Scalars['String']>;
  datePublished?: Maybe<Scalars['String']>;
  domain?: Maybe<Scalars['String']>;
  excerpt?: Maybe<Scalars['String']>;
  imageUrl?: Maybe<Scalars['String']>;
  isCollection?: Maybe<Scalars['Boolean']>;
  isSyndicated?: Maybe<Scalars['Boolean']>;
  language?: Maybe<Scalars['String']>;
  publisher?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  url: Scalars['String'];
};

/** Resolve by reference the User entity in this graph to provide user data with public lists. */
export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
};

/** A Video, typically within an Article View of an Item or if the Item is a video itself. */
export type Video = {
  __typename?: 'Video';
  /** If known, the height of the video in px */
  height?: Maybe<Scalars['Int']>;
  /** If known, the length of the video in seconds */
  length?: Maybe<Scalars['Int']>;
  /** Absolute url to the video */
  src: Scalars['String'];
  /** The type of video */
  type: VideoType;
  /** The video's id within the service defined by type */
  vid?: Maybe<Scalars['String']>;
  /** The id of the video within Article View. Item.article will have placeholders of <div id='RIL_VID_X' /> where X is this id. Apps can download those images as needed and populate them in their article view. */
  videoId: Scalars['Int'];
  /** If known, the width of the video in px */
  width?: Maybe<Scalars['Int']>;
};

export enum VideoType {
  /** Brightcove (v3 value is 8) */
  Brightcove = 'BRIGHTCOVE',
  /** Dailymotion (v3 value is 9) */
  Dailymotion = 'DAILYMOTION',
  /** Flash (v3 value is 6) */
  Flash = 'FLASH',
  /** html5 (v3 value is 5) */
  Html5 = 'HTML5',
  /** iframe (v3 value is 7) */
  Iframe = 'IFRAME',
  /** video iframe (v3 value is 4) */
  VimeoIframe = 'VIMEO_IFRAME',
  /** Vimeo Link (v3 value is 2) */
  VimeoLink = 'VIMEO_LINK',
  /** Vimeo Moogaloop (v3 value is 3) */
  VimeoMoogaloop = 'VIMEO_MOOGALOOP',
  /** Youtube (v3 value is 1) */
  Youtube = 'YOUTUBE',
}

export enum Videoness {
  /** Contains videos (v3 value is 1) */
  HasVideos = 'HAS_VIDEOS',
  /** Is a video (v3 value is 2) */
  IsVideo = 'IS_VIDEO',
  /** No videos (v3 value is 0) */
  NoVideos = 'NO_VIDEOS',
}

export type BasicParserItemDataFragment = {
  __typename?: 'Item';
  givenUrl: any;
  itemId: string;
  normalUrl: string;
  datePublished?: any | null;
  timeToRead?: number | null;
};

export type CollectionAuthorDataFragment = {
  __typename?: 'CollectionAuthor';
  externalId: string;
  name: string;
  slug?: string | null;
  bio?: any | null;
  imageUrl?: any | null;
  active: boolean;
};

export type CollectionDataFragment = {
  __typename?: 'Collection';
  externalId: string;
  title: string;
  slug: string;
  excerpt?: any | null;
  intro?: any | null;
  imageUrl?: any | null;
  language: CollectionLanguage;
  status: CollectionStatus;
  authors: Array<{
    __typename?: 'CollectionAuthor';
    externalId: string;
    name: string;
    slug?: string | null;
    bio?: any | null;
    imageUrl?: any | null;
    active: boolean;
  }>;
  curationCategory?: {
    __typename?: 'CurationCategory';
    externalId: string;
    name: string;
    slug: string;
  } | null;
  IABParentCategory?: {
    __typename?: 'IABCategory';
    externalId: string;
    name: string;
    slug: string;
  } | null;
  IABChildCategory?: {
    __typename?: 'IABCategory';
    externalId: string;
    name: string;
    slug: string;
  } | null;
  labels?: Array<{
    __typename?: 'Label';
    externalId: string;
    name: string;
  } | null> | null;
  partnership?: {
    __typename?: 'CollectionPartnership';
    externalId: string;
    type: CollectionPartnershipType;
    name: string;
    url: any;
    imageUrl: any;
    blurb: any;
  } | null;
};

export type CollectionPartnerAssociationDataFragment = {
  __typename?: 'CollectionPartnerAssociation';
  externalId: string;
  type: CollectionPartnershipType;
  name?: string | null;
  url?: any | null;
  imageUrl?: any | null;
  blurb?: any | null;
  partner: {
    __typename?: 'CollectionPartner';
    externalId: string;
    name: string;
    url: any;
    imageUrl: any;
    blurb: any;
  };
};

export type CollectionPartnerDataFragment = {
  __typename?: 'CollectionPartner';
  externalId: string;
  name: string;
  url: any;
  imageUrl: any;
  blurb: any;
};

export type CollectionStoryDataFragment = {
  __typename?: 'CollectionStory';
  externalId: string;
  url: any;
  title: string;
  excerpt: any;
  imageUrl?: any | null;
  publisher?: string | null;
  fromPartner: boolean;
  sortOrder?: number | null;
  authors: Array<{
    __typename?: 'CollectionStoryAuthor';
    name: string;
    sortOrder: number;
  }>;
};

export type CuratedItemDataWithHistoryFragment = {
  __typename?: 'ApprovedCorpusItem';
  externalId: string;
  prospectId?: string | null;
  title: string;
  language: CorpusLanguage;
  publisher: string;
  url: any;
  hasTrustedDomain: boolean;
  imageUrl: any;
  excerpt: string;
  status: CuratedStatus;
  source: CorpusItemSource;
  topic: string;
  isCollection: boolean;
  isTimeSensitive: boolean;
  isSyndicated: boolean;
  createdBy: string;
  createdAt: number;
  updatedBy?: string | null;
  updatedAt: number;
  authors: Array<{
    __typename?: 'CorpusItemAuthor';
    name: string;
    sortOrder: number;
  }>;
  scheduledSurfaceHistory: Array<{
    __typename?: 'ApprovedCorpusItemScheduledSurfaceHistory';
    externalId: string;
    createdBy: string;
    scheduledDate: any;
    scheduledSurfaceGuid: string;
  }>;
};

export type BaseSectionDataFragment = {
  __typename?: 'Section';
  externalId: string;
  title: string;
  scheduledSurfaceGuid: string;
  sort?: number | null;
  createSource: ActivitySource;
  disabled: boolean;
  active: boolean;
  description?: string | null;
  heroTitle?: string | null;
  heroDescription?: string | null;
  startDate?: any | null;
  endDate?: any | null;
  status: SectionStatus;
  iab?: {
    __typename?: 'IABMetadata';
    taxonomy: string;
    categories: Array<string>;
  } | null;
};

export type SectionDataFragment = {
  __typename?: 'Section';
  createdAt: number;
  updatedAt: number;
  externalId: string;
  title: string;
  scheduledSurfaceGuid: string;
  sort?: number | null;
  createSource: ActivitySource;
  disabled: boolean;
  active: boolean;
  description?: string | null;
  heroTitle?: string | null;
  heroDescription?: string | null;
  startDate?: any | null;
  endDate?: any | null;
  status: SectionStatus;
  sectionItems: Array<{
    __typename?: 'SectionItem';
    createdAt: number;
    updatedAt: number;
    externalId: string;
    rank?: number | null;
    approvedItem: {
      __typename?: 'ApprovedCorpusItem';
      externalId: string;
      prospectId?: string | null;
      title: string;
      language: CorpusLanguage;
      publisher: string;
      datePublished?: any | null;
      url: any;
      hasTrustedDomain: boolean;
      imageUrl: any;
      excerpt: string;
      status: CuratedStatus;
      source: CorpusItemSource;
      topic: string;
      isCollection: boolean;
      isTimeSensitive: boolean;
      isSyndicated: boolean;
      createdBy: string;
      createdAt: number;
      updatedBy?: string | null;
      updatedAt: number;
      authors: Array<{
        __typename?: 'CorpusItemAuthor';
        name: string;
        sortOrder: number;
      }>;
      scheduledSurfaceHistory: Array<{
        __typename?: 'ApprovedCorpusItemScheduledSurfaceHistory';
        externalId: string;
        createdBy: string;
        scheduledDate: any;
        scheduledSurfaceGuid: string;
      }>;
    };
  }>;
  iab?: {
    __typename?: 'IABMetadata';
    taxonomy: string;
    categories: Array<string>;
  } | null;
};

export type BaseSectionItemDataFragment = {
  __typename?: 'SectionItem';
  externalId: string;
  rank?: number | null;
};

export type SectionItemDataFragment = {
  __typename?: 'SectionItem';
  createdAt: number;
  updatedAt: number;
  externalId: string;
  rank?: number | null;
  approvedItem: {
    __typename?: 'ApprovedCorpusItem';
    externalId: string;
    prospectId?: string | null;
    title: string;
    language: CorpusLanguage;
    publisher: string;
    datePublished?: any | null;
    url: any;
    hasTrustedDomain: boolean;
    imageUrl: any;
    excerpt: string;
    status: CuratedStatus;
    source: CorpusItemSource;
    topic: string;
    isCollection: boolean;
    isTimeSensitive: boolean;
    isSyndicated: boolean;
    createdBy: string;
    createdAt: number;
    updatedBy?: string | null;
    updatedAt: number;
    authors: Array<{
      __typename?: 'CorpusItemAuthor';
      name: string;
      sortOrder: number;
    }>;
    scheduledSurfaceHistory: Array<{
      __typename?: 'ApprovedCorpusItemScheduledSurfaceHistory';
      externalId: string;
      createdBy: string;
      scheduledDate: any;
      scheduledSurfaceGuid: string;
    }>;
  };
};

export type ShareableListCompletePropsFragment = {
  __typename?: 'ShareableListComplete';
  externalId: string;
  title: string;
  description?: string | null;
  slug?: string | null;
  status: ShareableListVisibility;
  moderationStatus: ShareableListModerationStatus;
  createdAt: any;
  updatedAt: any;
  moderatedBy?: string | null;
  moderationReason?: ShareableListModerationReason | null;
  moderationDetails?: string | null;
  restorationReason?: string | null;
  listItemNoteVisibility: ShareableListVisibility;
  listItems: Array<{
    __typename?: 'ShareableListItem';
    externalId: string;
    itemId: string;
    url: any;
    title?: string | null;
    excerpt?: string | null;
    imageUrl?: any | null;
    publisher?: string | null;
    authors?: string | null;
    note?: string | null;
    sortOrder: number;
    createdAt: any;
    updatedAt: any;
  }>;
  user: { __typename?: 'User'; id: string };
};

export type ShareableListItemPropsFragment = {
  __typename?: 'ShareableListItem';
  externalId: string;
  itemId: string;
  url: any;
  title?: string | null;
  excerpt?: string | null;
  imageUrl?: any | null;
  publisher?: string | null;
  authors?: string | null;
  note?: string | null;
  sortOrder: number;
  createdAt: any;
  updatedAt: any;
};

export type CuratedItemDataFragment = {
  __typename?: 'ApprovedCorpusItem';
  externalId: string;
  prospectId?: string | null;
  title: string;
  language: CorpusLanguage;
  publisher: string;
  datePublished?: any | null;
  url: any;
  hasTrustedDomain: boolean;
  imageUrl: any;
  excerpt: string;
  status: CuratedStatus;
  source: CorpusItemSource;
  topic: string;
  isCollection: boolean;
  isTimeSensitive: boolean;
  isSyndicated: boolean;
  createdBy: string;
  createdAt: number;
  updatedBy?: string | null;
  updatedAt: number;
  authors: Array<{
    __typename?: 'CorpusItemAuthor';
    name: string;
    sortOrder: number;
  }>;
  scheduledSurfaceHistory: Array<{
    __typename?: 'ApprovedCorpusItemScheduledSurfaceHistory';
    externalId: string;
    createdBy: string;
    scheduledDate: any;
    scheduledSurfaceGuid: string;
  }>;
};

export type ProspectDataFragment = {
  __typename?: 'Prospect';
  id: string;
  prospectId: string;
  scheduledSurfaceGuid: string;
  topic?: string | null;
  prospectType: string;
  url: string;
  createdAt?: number | null;
  imageUrl?: string | null;
  authors?: string | null;
  publisher?: string | null;
  domain?: string | null;
  title?: string | null;
  excerpt?: string | null;
  language?: CorpusLanguage | null;
  saveCount?: number | null;
  isSyndicated?: boolean | null;
  isCollection?: boolean | null;
};

export type ProspectDataWithCorpusItemsFragment = {
  __typename?: 'Prospect';
  id: string;
  prospectId: string;
  scheduledSurfaceGuid: string;
  topic?: string | null;
  prospectType: string;
  url: string;
  createdAt?: number | null;
  imageUrl?: string | null;
  authors?: string | null;
  publisher?: string | null;
  domain?: string | null;
  title?: string | null;
  excerpt?: string | null;
  language?: CorpusLanguage | null;
  saveCount?: number | null;
  isSyndicated?: boolean | null;
  isCollection?: boolean | null;
  approvedCorpusItem?: {
    __typename?: 'ApprovedCorpusItem';
    externalId: string;
    prospectId?: string | null;
    title: string;
    language: CorpusLanguage;
    publisher: string;
    url: any;
    hasTrustedDomain: boolean;
    imageUrl: any;
    excerpt: string;
    status: CuratedStatus;
    source: CorpusItemSource;
    topic: string;
    isCollection: boolean;
    isTimeSensitive: boolean;
    isSyndicated: boolean;
    createdBy: string;
    createdAt: number;
    updatedBy?: string | null;
    updatedAt: number;
    authors: Array<{
      __typename?: 'CorpusItemAuthor';
      name: string;
      sortOrder: number;
    }>;
    scheduledSurfaceHistory: Array<{
      __typename?: 'ApprovedCorpusItemScheduledSurfaceHistory';
      externalId: string;
      createdBy: string;
      scheduledDate: any;
      scheduledSurfaceGuid: string;
    }>;
  } | null;
  rejectedCorpusItem?: {
    __typename?: 'RejectedCorpusItem';
    externalId: string;
    prospectId?: string | null;
    url: any;
    title?: string | null;
    topic?: string | null;
    language?: CorpusLanguage | null;
    publisher?: string | null;
    reason: string;
    createdBy: string;
    createdAt: number;
  } | null;
  item?: {
    __typename?: 'Item';
    givenUrl: any;
    itemId: string;
    normalUrl: string;
    datePublished?: any | null;
    timeToRead?: number | null;
  } | null;
};

export type RejectedItemDataFragment = {
  __typename?: 'RejectedCorpusItem';
  externalId: string;
  prospectId?: string | null;
  url: any;
  title?: string | null;
  topic?: string | null;
  language?: CorpusLanguage | null;
  publisher?: string | null;
  reason: string;
  createdBy: string;
  createdAt: number;
};

export type ScheduledItemDataFragment = {
  __typename?: 'ScheduledCorpusItem';
  scheduledSurfaceGuid: string;
  createdAt: number;
  createdBy: string;
  externalId: string;
  scheduledDate: any;
  updatedAt: number;
  updatedBy?: string | null;
  source: ActivitySource;
  approvedItem: {
    __typename?: 'ApprovedCorpusItem';
    externalId: string;
    prospectId?: string | null;
    title: string;
    language: CorpusLanguage;
    publisher: string;
    datePublished?: any | null;
    url: any;
    hasTrustedDomain: boolean;
    imageUrl: any;
    excerpt: string;
    status: CuratedStatus;
    source: CorpusItemSource;
    topic: string;
    isCollection: boolean;
    isTimeSensitive: boolean;
    isSyndicated: boolean;
    createdBy: string;
    createdAt: number;
    updatedBy?: string | null;
    updatedAt: number;
    authors: Array<{
      __typename?: 'CorpusItemAuthor';
      name: string;
      sortOrder: number;
    }>;
    scheduledSurfaceHistory: Array<{
      __typename?: 'ApprovedCorpusItemScheduledSurfaceHistory';
      externalId: string;
      createdBy: string;
      scheduledDate: any;
      scheduledSurfaceGuid: string;
    }>;
  };
};

export type UrlMetadataFragment = {
  __typename?: 'UrlMetadata';
  url: string;
  imageUrl?: string | null;
  publisher?: string | null;
  datePublished?: string | null;
  domain?: string | null;
  title?: string | null;
  excerpt?: string | null;
  language?: string | null;
  isSyndicated?: boolean | null;
  isCollection?: boolean | null;
  authors?: string | null;
};

export type CreateApprovedCorpusItemMutationVariables = Exact<{
  data: CreateApprovedCorpusItemInput;
}>;

export type CreateApprovedCorpusItemMutation = {
  __typename?: 'Mutation';
  createApprovedCorpusItem: {
    __typename?: 'ApprovedCorpusItem';
    externalId: string;
    prospectId?: string | null;
    title: string;
    language: CorpusLanguage;
    publisher: string;
    datePublished?: any | null;
    url: any;
    hasTrustedDomain: boolean;
    imageUrl: any;
    excerpt: string;
    status: CuratedStatus;
    source: CorpusItemSource;
    topic: string;
    isCollection: boolean;
    isTimeSensitive: boolean;
    isSyndicated: boolean;
    createdBy: string;
    createdAt: number;
    updatedBy?: string | null;
    updatedAt: number;
    authors: Array<{
      __typename?: 'CorpusItemAuthor';
      name: string;
      sortOrder: number;
    }>;
    scheduledSurfaceHistory: Array<{
      __typename?: 'ApprovedCorpusItemScheduledSurfaceHistory';
      externalId: string;
      createdBy: string;
      scheduledDate: any;
      scheduledSurfaceGuid: string;
    }>;
  };
};

export type CreateCollectionMutationVariables = Exact<{
  data: CreateCollectionInput;
}>;

export type CreateCollectionMutation = {
  __typename?: 'Mutation';
  createCollection: {
    __typename?: 'Collection';
    externalId: string;
    title: string;
    slug: string;
    excerpt?: any | null;
    intro?: any | null;
    imageUrl?: any | null;
    language: CollectionLanguage;
    status: CollectionStatus;
    authors: Array<{
      __typename?: 'CollectionAuthor';
      externalId: string;
      name: string;
      slug?: string | null;
      bio?: any | null;
      imageUrl?: any | null;
      active: boolean;
    }>;
    curationCategory?: {
      __typename?: 'CurationCategory';
      externalId: string;
      name: string;
      slug: string;
    } | null;
    IABParentCategory?: {
      __typename?: 'IABCategory';
      externalId: string;
      name: string;
      slug: string;
    } | null;
    IABChildCategory?: {
      __typename?: 'IABCategory';
      externalId: string;
      name: string;
      slug: string;
    } | null;
    labels?: Array<{
      __typename?: 'Label';
      externalId: string;
      name: string;
    } | null> | null;
    partnership?: {
      __typename?: 'CollectionPartnership';
      externalId: string;
      type: CollectionPartnershipType;
      name: string;
      url: any;
      imageUrl: any;
      blurb: any;
    } | null;
  };
};

export type CreateCollectionAuthorMutationVariables = Exact<{
  name: Scalars['String'];
  slug?: InputMaybe<Scalars['String']>;
  bio?: InputMaybe<Scalars['Markdown']>;
  imageUrl?: InputMaybe<Scalars['Url']>;
  active?: InputMaybe<Scalars['Boolean']>;
}>;

export type CreateCollectionAuthorMutation = {
  __typename?: 'Mutation';
  createCollectionAuthor: {
    __typename?: 'CollectionAuthor';
    externalId: string;
    name: string;
    slug?: string | null;
    bio?: any | null;
    imageUrl?: any | null;
    active: boolean;
  };
};

export type CreateCollectionPartnerMutationVariables = Exact<{
  name: Scalars['String'];
  url: Scalars['Url'];
  blurb: Scalars['Markdown'];
  imageUrl: Scalars['Url'];
}>;

export type CreateCollectionPartnerMutation = {
  __typename?: 'Mutation';
  createCollectionPartner: {
    __typename?: 'CollectionPartner';
    externalId: string;
    name: string;
    url: any;
    imageUrl: any;
    blurb: any;
  };
};

export type CreateCollectionPartnerAssociationMutationVariables = Exact<{
  type: CollectionPartnershipType;
  partnerExternalId: Scalars['String'];
  collectionExternalId: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
  url?: InputMaybe<Scalars['Url']>;
  imageUrl?: InputMaybe<Scalars['Url']>;
  blurb?: InputMaybe<Scalars['Markdown']>;
}>;

export type CreateCollectionPartnerAssociationMutation = {
  __typename?: 'Mutation';
  createCollectionPartnerAssociation: {
    __typename?: 'CollectionPartnerAssociation';
    externalId: string;
    type: CollectionPartnershipType;
    name?: string | null;
    url?: any | null;
    imageUrl?: any | null;
    blurb?: any | null;
    partner: {
      __typename?: 'CollectionPartner';
      externalId: string;
      name: string;
      url: any;
      imageUrl: any;
      blurb: any;
    };
  };
};

export type CreateCollectionStoryMutationVariables = Exact<{
  collectionExternalId: Scalars['String'];
  url: Scalars['Url'];
  title: Scalars['String'];
  excerpt: Scalars['Markdown'];
  imageUrl: Scalars['Url'];
  authors: Array<CollectionStoryAuthorInput> | CollectionStoryAuthorInput;
  publisher: Scalars['String'];
  sortOrder?: InputMaybe<Scalars['Int']>;
  fromPartner?: InputMaybe<Scalars['Boolean']>;
}>;

export type CreateCollectionStoryMutation = {
  __typename?: 'Mutation';
  createCollectionStory: {
    __typename?: 'CollectionStory';
    externalId: string;
    url: any;
    title: string;
    excerpt: any;
    imageUrl?: any | null;
    publisher?: string | null;
    fromPartner: boolean;
    sortOrder?: number | null;
    authors: Array<{
      __typename?: 'CollectionStoryAuthor';
      name: string;
      sortOrder: number;
    }>;
  };
};

export type CreateCustomSectionMutationVariables = Exact<{
  data: CreateCustomSectionInput;
}>;

export type CreateCustomSectionMutation = {
  __typename?: 'Mutation';
  createCustomSection: {
    __typename?: 'Section';
    externalId: string;
    title: string;
    scheduledSurfaceGuid: string;
    sort?: number | null;
    createSource: ActivitySource;
    disabled: boolean;
    active: boolean;
    description?: string | null;
    heroTitle?: string | null;
    heroDescription?: string | null;
    startDate?: any | null;
    endDate?: any | null;
    status: SectionStatus;
    iab?: {
      __typename?: 'IABMetadata';
      taxonomy: string;
      categories: Array<string>;
    } | null;
  };
};

export type CreateLabelMutationVariables = Exact<{
  name: Scalars['String'];
}>;

export type CreateLabelMutation = {
  __typename?: 'Mutation';
  createLabel: { __typename?: 'Label'; externalId: string; name: string };
};

export type CreateScheduledCorpusItemMutationVariables = Exact<{
  approvedItemExternalId: Scalars['ID'];
  scheduledSurfaceGuid: Scalars['ID'];
  scheduledDate: Scalars['Date'];
  source: ActivitySource;
  reasons?: InputMaybe<Scalars['String']>;
  reasonComment?: InputMaybe<Scalars['String']>;
  actionScreen?: InputMaybe<ActionScreen>;
}>;

export type CreateScheduledCorpusItemMutation = {
  __typename?: 'Mutation';
  createScheduledCorpusItem: {
    __typename?: 'ScheduledCorpusItem';
    externalId: string;
    createdAt: number;
    createdBy: string;
    updatedAt: number;
    updatedBy?: string | null;
    scheduledDate: any;
    approvedItem: {
      __typename?: 'ApprovedCorpusItem';
      externalId: string;
      prospectId?: string | null;
      title: string;
      language: CorpusLanguage;
      publisher: string;
      datePublished?: any | null;
      url: any;
      hasTrustedDomain: boolean;
      imageUrl: any;
      excerpt: string;
      status: CuratedStatus;
      source: CorpusItemSource;
      topic: string;
      isCollection: boolean;
      isTimeSensitive: boolean;
      isSyndicated: boolean;
      createdBy: string;
      createdAt: number;
      updatedBy?: string | null;
      updatedAt: number;
      authors: Array<{
        __typename?: 'CorpusItemAuthor';
        name: string;
        sortOrder: number;
      }>;
      scheduledSurfaceHistory: Array<{
        __typename?: 'ApprovedCorpusItemScheduledSurfaceHistory';
        externalId: string;
        createdBy: string;
        scheduledDate: any;
        scheduledSurfaceGuid: string;
      }>;
    };
  };
};

export type DeleteCollectionPartnerAssociationMutationVariables = Exact<{
  externalId: Scalars['String'];
}>;

export type DeleteCollectionPartnerAssociationMutation = {
  __typename?: 'Mutation';
  deleteCollectionPartnerAssociation: {
    __typename?: 'CollectionPartnerAssociation';
    externalId: string;
    type: CollectionPartnershipType;
    name?: string | null;
    url?: any | null;
    imageUrl?: any | null;
    blurb?: any | null;
    partner: {
      __typename?: 'CollectionPartner';
      externalId: string;
      name: string;
      url: any;
      imageUrl: any;
      blurb: any;
    };
  };
};

export type DeleteCollectionStoryMutationVariables = Exact<{
  externalId: Scalars['String'];
}>;

export type DeleteCollectionStoryMutation = {
  __typename?: 'Mutation';
  deleteCollectionStory: {
    __typename?: 'CollectionStory';
    externalId: string;
    url: any;
    title: string;
    excerpt: any;
    imageUrl?: any | null;
    publisher?: string | null;
    fromPartner: boolean;
    sortOrder?: number | null;
    authors: Array<{
      __typename?: 'CollectionStoryAuthor';
      name: string;
      sortOrder: number;
    }>;
  };
};

export type DeleteScheduledItemMutationVariables = Exact<{
  data: DeleteScheduledCorpusItemInput;
}>;

export type DeleteScheduledItemMutation = {
  __typename?: 'Mutation';
  deleteScheduledCorpusItem: {
    __typename?: 'ScheduledCorpusItem';
    externalId: string;
    createdAt: number;
    createdBy: string;
    updatedAt: number;
    updatedBy?: string | null;
    scheduledDate: any;
    approvedItem: {
      __typename?: 'ApprovedCorpusItem';
      externalId: string;
      prospectId?: string | null;
      title: string;
      language: CorpusLanguage;
      publisher: string;
      datePublished?: any | null;
      url: any;
      hasTrustedDomain: boolean;
      imageUrl: any;
      excerpt: string;
      status: CuratedStatus;
      source: CorpusItemSource;
      topic: string;
      isCollection: boolean;
      isTimeSensitive: boolean;
      isSyndicated: boolean;
      createdBy: string;
      createdAt: number;
      updatedBy?: string | null;
      updatedAt: number;
      authors: Array<{
        __typename?: 'CorpusItemAuthor';
        name: string;
        sortOrder: number;
      }>;
      scheduledSurfaceHistory: Array<{
        __typename?: 'ApprovedCorpusItemScheduledSurfaceHistory';
        externalId: string;
        createdBy: string;
        scheduledDate: any;
        scheduledSurfaceGuid: string;
      }>;
    };
  };
};

export type DisableEnableSectionMutationVariables = Exact<{
  data: DisableEnableSectionInput;
}>;

export type DisableEnableSectionMutation = {
  __typename?: 'Mutation';
  disableEnableSection: {
    __typename?: 'Section';
    createdAt: number;
    updatedAt: number;
    externalId: string;
    title: string;
    scheduledSurfaceGuid: string;
    sort?: number | null;
    createSource: ActivitySource;
    disabled: boolean;
    active: boolean;
    description?: string | null;
    heroTitle?: string | null;
    heroDescription?: string | null;
    startDate?: any | null;
    endDate?: any | null;
    status: SectionStatus;
    sectionItems: Array<{
      __typename?: 'SectionItem';
      createdAt: number;
      updatedAt: number;
      externalId: string;
      rank?: number | null;
      approvedItem: {
        __typename?: 'ApprovedCorpusItem';
        externalId: string;
        prospectId?: string | null;
        title: string;
        language: CorpusLanguage;
        publisher: string;
        datePublished?: any | null;
        url: any;
        hasTrustedDomain: boolean;
        imageUrl: any;
        excerpt: string;
        status: CuratedStatus;
        source: CorpusItemSource;
        topic: string;
        isCollection: boolean;
        isTimeSensitive: boolean;
        isSyndicated: boolean;
        createdBy: string;
        createdAt: number;
        updatedBy?: string | null;
        updatedAt: number;
        authors: Array<{
          __typename?: 'CorpusItemAuthor';
          name: string;
          sortOrder: number;
        }>;
        scheduledSurfaceHistory: Array<{
          __typename?: 'ApprovedCorpusItemScheduledSurfaceHistory';
          externalId: string;
          createdBy: string;
          scheduledDate: any;
          scheduledSurfaceGuid: string;
        }>;
      };
    }>;
    iab?: {
      __typename?: 'IABMetadata';
      taxonomy: string;
      categories: Array<string>;
    } | null;
  };
};

export type ImageUploadMutationVariables = Exact<{
  image: Scalars['Upload'];
  width: Scalars['Int'];
  height: Scalars['Int'];
  fileSizeBytes: Scalars['Int'];
}>;

export type ImageUploadMutation = {
  __typename?: 'Mutation';
  collectionImageUpload: { __typename?: 'CollectionImageUrl'; url: string };
};

export type ModerateShareableListMutationVariables = Exact<{
  data: ModerateShareableListInput;
}>;

export type ModerateShareableListMutation = {
  __typename?: 'Mutation';
  moderateShareableList?: {
    __typename?: 'ShareableListComplete';
    externalId: string;
    title: string;
    description?: string | null;
    slug?: string | null;
    status: ShareableListVisibility;
    moderationStatus: ShareableListModerationStatus;
    createdAt: any;
    updatedAt: any;
    moderatedBy?: string | null;
    moderationReason?: ShareableListModerationReason | null;
    moderationDetails?: string | null;
    restorationReason?: string | null;
    listItemNoteVisibility: ShareableListVisibility;
    listItems: Array<{
      __typename?: 'ShareableListItem';
      externalId: string;
      itemId: string;
      url: any;
      title?: string | null;
      excerpt?: string | null;
      imageUrl?: any | null;
      publisher?: string | null;
      authors?: string | null;
      note?: string | null;
      sortOrder: number;
      createdAt: any;
      updatedAt: any;
    }>;
    user: { __typename?: 'User'; id: string };
  } | null;
};

export type RejectApprovedItemMutationVariables = Exact<{
  data: RejectApprovedCorpusItemInput;
}>;

export type RejectApprovedItemMutation = {
  __typename?: 'Mutation';
  rejectApprovedCorpusItem: {
    __typename?: 'ApprovedCorpusItem';
    externalId: string;
    prospectId?: string | null;
    title: string;
    language: CorpusLanguage;
    publisher: string;
    datePublished?: any | null;
    url: any;
    hasTrustedDomain: boolean;
    imageUrl: any;
    excerpt: string;
    status: CuratedStatus;
    source: CorpusItemSource;
    topic: string;
    isCollection: boolean;
    isTimeSensitive: boolean;
    isSyndicated: boolean;
    createdBy: string;
    createdAt: number;
    updatedBy?: string | null;
    updatedAt: number;
    authors: Array<{
      __typename?: 'CorpusItemAuthor';
      name: string;
      sortOrder: number;
    }>;
    scheduledSurfaceHistory: Array<{
      __typename?: 'ApprovedCorpusItemScheduledSurfaceHistory';
      externalId: string;
      createdBy: string;
      scheduledDate: any;
      scheduledSurfaceGuid: string;
    }>;
  };
};

export type RejectProspectMutationVariables = Exact<{
  data: CreateRejectedCorpusItemInput;
}>;

export type RejectProspectMutation = {
  __typename?: 'Mutation';
  createRejectedCorpusItem: {
    __typename?: 'RejectedCorpusItem';
    externalId: string;
    prospectId?: string | null;
    url: any;
    title?: string | null;
    topic?: string | null;
    language?: CorpusLanguage | null;
    publisher?: string | null;
    reason: string;
    createdBy: string;
    createdAt: number;
  };
};

export type RemoveProspectMutationVariables = Exact<{
  data: RemoveProspectInput;
}>;

export type RemoveProspectMutation = {
  __typename?: 'Mutation';
  removeProspect?: {
    __typename?: 'Prospect';
    id: string;
    prospectId: string;
    scheduledSurfaceGuid: string;
    topic?: string | null;
    prospectType: string;
    url: string;
    createdAt?: number | null;
    imageUrl?: string | null;
    authors?: string | null;
    publisher?: string | null;
    domain?: string | null;
    title?: string | null;
    excerpt?: string | null;
    language?: CorpusLanguage | null;
    saveCount?: number | null;
    isSyndicated?: boolean | null;
    isCollection?: boolean | null;
  } | null;
};

export type RemoveSectionItemMutationVariables = Exact<{
  data: RemoveSectionItemInput;
}>;

export type RemoveSectionItemMutation = {
  __typename?: 'Mutation';
  removeSectionItem: {
    __typename?: 'SectionItem';
    createdAt: number;
    updatedAt: number;
    externalId: string;
    rank?: number | null;
    approvedItem: {
      __typename?: 'ApprovedCorpusItem';
      externalId: string;
      prospectId?: string | null;
      title: string;
      language: CorpusLanguage;
      publisher: string;
      datePublished?: any | null;
      url: any;
      hasTrustedDomain: boolean;
      imageUrl: any;
      excerpt: string;
      status: CuratedStatus;
      source: CorpusItemSource;
      topic: string;
      isCollection: boolean;
      isTimeSensitive: boolean;
      isSyndicated: boolean;
      createdBy: string;
      createdAt: number;
      updatedBy?: string | null;
      updatedAt: number;
      authors: Array<{
        __typename?: 'CorpusItemAuthor';
        name: string;
        sortOrder: number;
      }>;
      scheduledSurfaceHistory: Array<{
        __typename?: 'ApprovedCorpusItemScheduledSurfaceHistory';
        externalId: string;
        createdBy: string;
        scheduledDate: any;
        scheduledSurfaceGuid: string;
      }>;
    };
  };
};

export type RescheduleScheduledCorpusItemMutationVariables = Exact<{
  externalId: Scalars['ID'];
  scheduledDate: Scalars['Date'];
  source: ActivitySource;
  actionScreen?: InputMaybe<ActionScreen>;
}>;

export type RescheduleScheduledCorpusItemMutation = {
  __typename?: 'Mutation';
  rescheduleScheduledCorpusItem: {
    __typename?: 'ScheduledCorpusItem';
    scheduledSurfaceGuid: string;
    createdAt: number;
    createdBy: string;
    externalId: string;
    scheduledDate: any;
    updatedAt: number;
    updatedBy?: string | null;
    source: ActivitySource;
    approvedItem: {
      __typename?: 'ApprovedCorpusItem';
      externalId: string;
      prospectId?: string | null;
      title: string;
      language: CorpusLanguage;
      publisher: string;
      datePublished?: any | null;
      url: any;
      hasTrustedDomain: boolean;
      imageUrl: any;
      excerpt: string;
      status: CuratedStatus;
      source: CorpusItemSource;
      topic: string;
      isCollection: boolean;
      isTimeSensitive: boolean;
      isSyndicated: boolean;
      createdBy: string;
      createdAt: number;
      updatedBy?: string | null;
      updatedAt: number;
      authors: Array<{
        __typename?: 'CorpusItemAuthor';
        name: string;
        sortOrder: number;
      }>;
      scheduledSurfaceHistory: Array<{
        __typename?: 'ApprovedCorpusItemScheduledSurfaceHistory';
        externalId: string;
        createdBy: string;
        scheduledDate: any;
        scheduledSurfaceGuid: string;
      }>;
    };
  };
};

export type UpdateApprovedCorpusItemMutationVariables = Exact<{
  data: UpdateApprovedCorpusItemInput;
}>;

export type UpdateApprovedCorpusItemMutation = {
  __typename?: 'Mutation';
  updateApprovedCorpusItem: {
    __typename?: 'ApprovedCorpusItem';
    externalId: string;
    prospectId?: string | null;
    title: string;
    language: CorpusLanguage;
    publisher: string;
    datePublished?: any | null;
    url: any;
    hasTrustedDomain: boolean;
    imageUrl: any;
    excerpt: string;
    status: CuratedStatus;
    source: CorpusItemSource;
    topic: string;
    isCollection: boolean;
    isTimeSensitive: boolean;
    isSyndicated: boolean;
    createdBy: string;
    createdAt: number;
    updatedBy?: string | null;
    updatedAt: number;
    authors: Array<{
      __typename?: 'CorpusItemAuthor';
      name: string;
      sortOrder: number;
    }>;
    scheduledSurfaceHistory: Array<{
      __typename?: 'ApprovedCorpusItemScheduledSurfaceHistory';
      externalId: string;
      createdBy: string;
      scheduledDate: any;
      scheduledSurfaceGuid: string;
    }>;
  };
};

export type UpdateCollectionMutationVariables = Exact<{
  data: UpdateCollectionInput;
}>;

export type UpdateCollectionMutation = {
  __typename?: 'Mutation';
  updateCollection: {
    __typename?: 'Collection';
    externalId: string;
    title: string;
    slug: string;
    excerpt?: any | null;
    intro?: any | null;
    imageUrl?: any | null;
    language: CollectionLanguage;
    status: CollectionStatus;
    authors: Array<{
      __typename?: 'CollectionAuthor';
      externalId: string;
      name: string;
      slug?: string | null;
      bio?: any | null;
      imageUrl?: any | null;
      active: boolean;
    }>;
    curationCategory?: {
      __typename?: 'CurationCategory';
      externalId: string;
      name: string;
      slug: string;
    } | null;
    IABParentCategory?: {
      __typename?: 'IABCategory';
      externalId: string;
      name: string;
      slug: string;
    } | null;
    IABChildCategory?: {
      __typename?: 'IABCategory';
      externalId: string;
      name: string;
      slug: string;
    } | null;
    labels?: Array<{
      __typename?: 'Label';
      externalId: string;
      name: string;
    } | null> | null;
    partnership?: {
      __typename?: 'CollectionPartnership';
      externalId: string;
      type: CollectionPartnershipType;
      name: string;
      url: any;
      imageUrl: any;
      blurb: any;
    } | null;
  };
};

export type UpdateCollectionAuthorMutationVariables = Exact<{
  externalId: Scalars['String'];
  name: Scalars['String'];
  slug: Scalars['String'];
  bio?: InputMaybe<Scalars['Markdown']>;
  imageUrl?: InputMaybe<Scalars['Url']>;
  active?: InputMaybe<Scalars['Boolean']>;
}>;

export type UpdateCollectionAuthorMutation = {
  __typename?: 'Mutation';
  updateCollectionAuthor: {
    __typename?: 'CollectionAuthor';
    externalId: string;
    name: string;
    slug?: string | null;
    bio?: any | null;
    imageUrl?: any | null;
    active: boolean;
  };
};

export type UpdateCollectionAuthorImageUrlMutationVariables = Exact<{
  externalId: Scalars['String'];
  imageUrl: Scalars['Url'];
}>;

export type UpdateCollectionAuthorImageUrlMutation = {
  __typename?: 'Mutation';
  updateCollectionAuthorImageUrl: {
    __typename?: 'CollectionAuthor';
    externalId: string;
    name: string;
    slug?: string | null;
    bio?: any | null;
    imageUrl?: any | null;
    active: boolean;
  };
};

export type UpdateCollectionImageUrlMutationVariables = Exact<{
  externalId: Scalars['String'];
  imageUrl: Scalars['Url'];
}>;

export type UpdateCollectionImageUrlMutation = {
  __typename?: 'Mutation';
  updateCollectionImageUrl: {
    __typename?: 'Collection';
    externalId: string;
    title: string;
    slug: string;
    excerpt?: any | null;
    intro?: any | null;
    imageUrl?: any | null;
    language: CollectionLanguage;
    status: CollectionStatus;
    authors: Array<{
      __typename?: 'CollectionAuthor';
      externalId: string;
      name: string;
      slug?: string | null;
      bio?: any | null;
      imageUrl?: any | null;
      active: boolean;
    }>;
    curationCategory?: {
      __typename?: 'CurationCategory';
      externalId: string;
      name: string;
      slug: string;
    } | null;
    IABParentCategory?: {
      __typename?: 'IABCategory';
      externalId: string;
      name: string;
      slug: string;
    } | null;
    IABChildCategory?: {
      __typename?: 'IABCategory';
      externalId: string;
      name: string;
      slug: string;
    } | null;
    labels?: Array<{
      __typename?: 'Label';
      externalId: string;
      name: string;
    } | null> | null;
    partnership?: {
      __typename?: 'CollectionPartnership';
      externalId: string;
      type: CollectionPartnershipType;
      name: string;
      url: any;
      imageUrl: any;
      blurb: any;
    } | null;
  };
};

export type UpdateCollectionPartnerMutationVariables = Exact<{
  externalId: Scalars['String'];
  name: Scalars['String'];
  url: Scalars['Url'];
  blurb: Scalars['Markdown'];
  imageUrl?: InputMaybe<Scalars['Url']>;
}>;

export type UpdateCollectionPartnerMutation = {
  __typename?: 'Mutation';
  updateCollectionPartner: {
    __typename?: 'CollectionPartner';
    externalId: string;
    name: string;
    url: any;
    imageUrl: any;
    blurb: any;
  };
};

export type UpdateCollectionPartnerAssociationMutationVariables = Exact<{
  externalId: Scalars['String'];
  type: CollectionPartnershipType;
  partnerExternalId: Scalars['String'];
  name?: InputMaybe<Scalars['String']>;
  url?: InputMaybe<Scalars['Url']>;
  imageUrl?: InputMaybe<Scalars['Url']>;
  blurb?: InputMaybe<Scalars['Markdown']>;
}>;

export type UpdateCollectionPartnerAssociationMutation = {
  __typename?: 'Mutation';
  updateCollectionPartnerAssociation: {
    __typename?: 'CollectionPartnerAssociation';
    externalId: string;
    type: CollectionPartnershipType;
    name?: string | null;
    url?: any | null;
    imageUrl?: any | null;
    blurb?: any | null;
    partner: {
      __typename?: 'CollectionPartner';
      externalId: string;
      name: string;
      url: any;
      imageUrl: any;
      blurb: any;
    };
  };
};

export type UpdateCollectionPartnerAssociationImageUrlMutationVariables =
  Exact<{
    externalId: Scalars['String'];
    imageUrl: Scalars['Url'];
  }>;

export type UpdateCollectionPartnerAssociationImageUrlMutation = {
  __typename?: 'Mutation';
  updateCollectionPartnerAssociationImageUrl: {
    __typename?: 'CollectionPartnerAssociation';
    externalId: string;
    type: CollectionPartnershipType;
    name?: string | null;
    url?: any | null;
    imageUrl?: any | null;
    blurb?: any | null;
    partner: {
      __typename?: 'CollectionPartner';
      externalId: string;
      name: string;
      url: any;
      imageUrl: any;
      blurb: any;
    };
  };
};

export type UpdateCollectionPartnerImageUrlMutationVariables = Exact<{
  externalId: Scalars['String'];
  imageUrl: Scalars['Url'];
}>;

export type UpdateCollectionPartnerImageUrlMutation = {
  __typename?: 'Mutation';
  updateCollectionPartnerImageUrl: {
    __typename?: 'CollectionPartner';
    externalId: string;
    name: string;
    url: any;
    imageUrl: any;
    blurb: any;
  };
};

export type UpdateCollectionStoryMutationVariables = Exact<{
  externalId: Scalars['String'];
  url: Scalars['Url'];
  title: Scalars['String'];
  excerpt: Scalars['Markdown'];
  imageUrl: Scalars['Url'];
  authors: Array<CollectionStoryAuthorInput> | CollectionStoryAuthorInput;
  publisher: Scalars['String'];
  sortOrder?: InputMaybe<Scalars['Int']>;
  fromPartner?: InputMaybe<Scalars['Boolean']>;
}>;

export type UpdateCollectionStoryMutation = {
  __typename?: 'Mutation';
  updateCollectionStory: {
    __typename?: 'CollectionStory';
    externalId: string;
    url: any;
    title: string;
    excerpt: any;
    imageUrl?: any | null;
    publisher?: string | null;
    fromPartner: boolean;
    sortOrder?: number | null;
    authors: Array<{
      __typename?: 'CollectionStoryAuthor';
      name: string;
      sortOrder: number;
    }>;
  };
};

export type UpdateCollectionStoryImageUrlMutationVariables = Exact<{
  externalId: Scalars['String'];
  imageUrl: Scalars['Url'];
}>;

export type UpdateCollectionStoryImageUrlMutation = {
  __typename?: 'Mutation';
  updateCollectionStoryImageUrl: {
    __typename?: 'CollectionStory';
    externalId: string;
    url: any;
    title: string;
    excerpt: any;
    imageUrl?: any | null;
    publisher?: string | null;
    fromPartner: boolean;
    sortOrder?: number | null;
    authors: Array<{
      __typename?: 'CollectionStoryAuthor';
      name: string;
      sortOrder: number;
    }>;
  };
};

export type UpdateCollectionStorySortOrderMutationVariables = Exact<{
  externalId: Scalars['String'];
  sortOrder: Scalars['Int'];
}>;

export type UpdateCollectionStorySortOrderMutation = {
  __typename?: 'Mutation';
  updateCollectionStorySortOrder: {
    __typename?: 'CollectionStory';
    externalId: string;
    url: any;
    title: string;
    excerpt: any;
    imageUrl?: any | null;
    publisher?: string | null;
    fromPartner: boolean;
    sortOrder?: number | null;
    authors: Array<{
      __typename?: 'CollectionStoryAuthor';
      name: string;
      sortOrder: number;
    }>;
  };
};

export type UpdateLabelMutationVariables = Exact<{
  data: UpdateLabelInput;
}>;

export type UpdateLabelMutation = {
  __typename?: 'Mutation';
  updateLabel: { __typename?: 'Label'; externalId: string; name: string };
};

export type UpdateProspectAsCuratedMutationVariables = Exact<{
  id: Scalars['ID'];
  historyFilter?: InputMaybe<ApprovedCorpusItemScheduledSurfaceHistoryFilters>;
}>;

export type UpdateProspectAsCuratedMutation = {
  __typename?: 'Mutation';
  updateProspectAsCurated?: {
    __typename?: 'Prospect';
    id: string;
    prospectId: string;
    scheduledSurfaceGuid: string;
    topic?: string | null;
    prospectType: string;
    url: string;
    createdAt?: number | null;
    imageUrl?: string | null;
    authors?: string | null;
    publisher?: string | null;
    domain?: string | null;
    title?: string | null;
    excerpt?: string | null;
    language?: CorpusLanguage | null;
    saveCount?: number | null;
    isSyndicated?: boolean | null;
    isCollection?: boolean | null;
    approvedCorpusItem?: {
      __typename?: 'ApprovedCorpusItem';
      externalId: string;
      prospectId?: string | null;
      title: string;
      language: CorpusLanguage;
      publisher: string;
      url: any;
      hasTrustedDomain: boolean;
      imageUrl: any;
      excerpt: string;
      status: CuratedStatus;
      source: CorpusItemSource;
      topic: string;
      isCollection: boolean;
      isTimeSensitive: boolean;
      isSyndicated: boolean;
      createdBy: string;
      createdAt: number;
      updatedBy?: string | null;
      updatedAt: number;
      authors: Array<{
        __typename?: 'CorpusItemAuthor';
        name: string;
        sortOrder: number;
      }>;
      scheduledSurfaceHistory: Array<{
        __typename?: 'ApprovedCorpusItemScheduledSurfaceHistory';
        externalId: string;
        createdBy: string;
        scheduledDate: any;
        scheduledSurfaceGuid: string;
      }>;
    } | null;
    rejectedCorpusItem?: {
      __typename?: 'RejectedCorpusItem';
      externalId: string;
      prospectId?: string | null;
      url: any;
      title?: string | null;
      topic?: string | null;
      language?: CorpusLanguage | null;
      publisher?: string | null;
      reason: string;
      createdBy: string;
      createdAt: number;
    } | null;
    item?: {
      __typename?: 'Item';
      givenUrl: any;
      itemId: string;
      normalUrl: string;
      datePublished?: any | null;
      timeToRead?: number | null;
    } | null;
  } | null;
};

export type UploadApprovedCorpusItemImageMutationVariables = Exact<{
  image: Scalars['Upload'];
}>;

export type UploadApprovedCorpusItemImageMutation = {
  __typename?: 'Mutation';
  uploadApprovedCorpusItemImage: {
    __typename?: 'ApprovedCorpusImageUrl';
    url: string;
  };
};

export type ApprovedCorpusItemByExternalIdQueryVariables = Exact<{
  externalId: Scalars['ID'];
  historyFilter?: InputMaybe<ApprovedCorpusItemScheduledSurfaceHistoryFilters>;
}>;

export type ApprovedCorpusItemByExternalIdQuery = {
  __typename?: 'Query';
  approvedCorpusItemByExternalId?: {
    __typename?: 'ApprovedCorpusItem';
    externalId: string;
    prospectId?: string | null;
    title: string;
    language: CorpusLanguage;
    publisher: string;
    url: any;
    hasTrustedDomain: boolean;
    imageUrl: any;
    excerpt: string;
    status: CuratedStatus;
    source: CorpusItemSource;
    topic: string;
    isCollection: boolean;
    isTimeSensitive: boolean;
    isSyndicated: boolean;
    createdBy: string;
    createdAt: number;
    updatedBy?: string | null;
    updatedAt: number;
    authors: Array<{
      __typename?: 'CorpusItemAuthor';
      name: string;
      sortOrder: number;
    }>;
    scheduledSurfaceHistory: Array<{
      __typename?: 'ApprovedCorpusItemScheduledSurfaceHistory';
      externalId: string;
      createdBy: string;
      scheduledDate: any;
      scheduledSurfaceGuid: string;
    }>;
  } | null;
};

export type GetApprovedItemByUrlQueryVariables = Exact<{
  url: Scalars['String'];
}>;

export type GetApprovedItemByUrlQuery = {
  __typename?: 'Query';
  getApprovedCorpusItemByUrl?: {
    __typename?: 'ApprovedCorpusItem';
    externalId: string;
    prospectId?: string | null;
    title: string;
    language: CorpusLanguage;
    publisher: string;
    datePublished?: any | null;
    url: any;
    hasTrustedDomain: boolean;
    imageUrl: any;
    excerpt: string;
    status: CuratedStatus;
    source: CorpusItemSource;
    topic: string;
    isCollection: boolean;
    isTimeSensitive: boolean;
    isSyndicated: boolean;
    createdBy: string;
    createdAt: number;
    updatedBy?: string | null;
    updatedAt: number;
    authors: Array<{
      __typename?: 'CorpusItemAuthor';
      name: string;
      sortOrder: number;
    }>;
    scheduledSurfaceHistory: Array<{
      __typename?: 'ApprovedCorpusItemScheduledSurfaceHistory';
      externalId: string;
      createdBy: string;
      scheduledDate: any;
      scheduledSurfaceGuid: string;
    }>;
  } | null;
};

export type GetApprovedItemsQueryVariables = Exact<{
  filters?: InputMaybe<ApprovedCorpusItemFilter>;
  pagination?: InputMaybe<PaginationInput>;
}>;

export type GetApprovedItemsQuery = {
  __typename?: 'Query';
  getApprovedCorpusItems: {
    __typename?: 'ApprovedCorpusItemConnection';
    totalCount: number;
    pageInfo: {
      __typename?: 'PageInfo';
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
    };
    edges: Array<{
      __typename?: 'ApprovedCorpusItemEdge';
      cursor: string;
      node: {
        __typename?: 'ApprovedCorpusItem';
        externalId: string;
        prospectId?: string | null;
        title: string;
        language: CorpusLanguage;
        publisher: string;
        datePublished?: any | null;
        url: any;
        hasTrustedDomain: boolean;
        imageUrl: any;
        excerpt: string;
        status: CuratedStatus;
        source: CorpusItemSource;
        topic: string;
        isCollection: boolean;
        isTimeSensitive: boolean;
        isSyndicated: boolean;
        createdBy: string;
        createdAt: number;
        updatedBy?: string | null;
        updatedAt: number;
        authors: Array<{
          __typename?: 'CorpusItemAuthor';
          name: string;
          sortOrder: number;
        }>;
        scheduledSurfaceHistory: Array<{
          __typename?: 'ApprovedCorpusItemScheduledSurfaceHistory';
          externalId: string;
          createdBy: string;
          scheduledDate: any;
          scheduledSurfaceGuid: string;
        }>;
      };
    }>;
  };
};

export type GetAuthorByIdQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type GetAuthorByIdQuery = {
  __typename?: 'Query';
  getCollectionAuthor?: {
    __typename?: 'CollectionAuthor';
    externalId: string;
    name: string;
    slug?: string | null;
    bio?: any | null;
    imageUrl?: any | null;
    active: boolean;
  } | null;
};

export type GetAuthorsQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
}>;

export type GetAuthorsQuery = {
  __typename?: 'Query';
  getCollectionAuthors: {
    __typename?: 'CollectionAuthorsResult';
    authors: Array<{
      __typename?: 'CollectionAuthor';
      externalId: string;
      name: string;
      slug?: string | null;
      bio?: any | null;
      imageUrl?: any | null;
      active: boolean;
    }>;
    pagination?: {
      __typename?: 'Pagination';
      currentPage: number;
      totalPages: number;
      totalResults: number;
    } | null;
  };
};

export type GetCollectionByExternalIdQueryVariables = Exact<{
  externalId: Scalars['String'];
}>;

export type GetCollectionByExternalIdQuery = {
  __typename?: 'Query';
  getCollection?: {
    __typename?: 'Collection';
    externalId: string;
    title: string;
    slug: string;
    excerpt?: any | null;
    intro?: any | null;
    imageUrl?: any | null;
    language: CollectionLanguage;
    status: CollectionStatus;
    authors: Array<{
      __typename?: 'CollectionAuthor';
      externalId: string;
      name: string;
      slug?: string | null;
      bio?: any | null;
      imageUrl?: any | null;
      active: boolean;
    }>;
    curationCategory?: {
      __typename?: 'CurationCategory';
      externalId: string;
      name: string;
      slug: string;
    } | null;
    IABParentCategory?: {
      __typename?: 'IABCategory';
      externalId: string;
      name: string;
      slug: string;
    } | null;
    IABChildCategory?: {
      __typename?: 'IABCategory';
      externalId: string;
      name: string;
      slug: string;
    } | null;
    labels?: Array<{
      __typename?: 'Label';
      externalId: string;
      name: string;
    } | null> | null;
    partnership?: {
      __typename?: 'CollectionPartnership';
      externalId: string;
      type: CollectionPartnershipType;
      name: string;
      url: any;
      imageUrl: any;
      blurb: any;
    } | null;
  } | null;
};

export type GetCollectionPartnerQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type GetCollectionPartnerQuery = {
  __typename?: 'Query';
  getCollectionPartner?: {
    __typename?: 'CollectionPartner';
    externalId: string;
    name: string;
    url: any;
    imageUrl: any;
    blurb: any;
  } | null;
};

export type GetCollectionPartnerAssociationQueryVariables = Exact<{
  externalId: Scalars['String'];
}>;

export type GetCollectionPartnerAssociationQuery = {
  __typename?: 'Query';
  getCollectionPartnerAssociationForCollection?: {
    __typename?: 'CollectionPartnerAssociation';
    externalId: string;
    type: CollectionPartnershipType;
    name?: string | null;
    url?: any | null;
    imageUrl?: any | null;
    blurb?: any | null;
    partner: {
      __typename?: 'CollectionPartner';
      externalId: string;
      name: string;
      url: any;
      imageUrl: any;
      blurb: any;
    };
  } | null;
};

export type GetCollectionPartnersQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
}>;

export type GetCollectionPartnersQuery = {
  __typename?: 'Query';
  getCollectionPartners: {
    __typename?: 'CollectionPartnersResult';
    partners: Array<{
      __typename?: 'CollectionPartner';
      externalId: string;
      name: string;
      url: any;
      imageUrl: any;
      blurb: any;
    }>;
    pagination?: {
      __typename?: 'Pagination';
      currentPage: number;
      totalPages: number;
      totalResults: number;
    } | null;
  };
};

export type GetCollectionStoriesQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type GetCollectionStoriesQuery = {
  __typename?: 'Query';
  getCollection?: {
    __typename?: 'Collection';
    externalId: string;
    stories: Array<{
      __typename?: 'CollectionStory';
      externalId: string;
      url: any;
      title: string;
      excerpt: any;
      imageUrl?: any | null;
      publisher?: string | null;
      fromPartner: boolean;
      sortOrder?: number | null;
      authors: Array<{
        __typename?: 'CollectionStoryAuthor';
        name: string;
        sortOrder: number;
      }>;
    }>;
  } | null;
};

export type GetCollectionsQueryVariables = Exact<{
  page: Scalars['Int'];
  perPage: Scalars['Int'];
  status: CollectionStatus;
}>;

export type GetCollectionsQuery = {
  __typename?: 'Query';
  searchCollections: {
    __typename?: 'CollectionsResult';
    collections: Array<{
      __typename?: 'Collection';
      externalId: string;
      title: string;
      slug: string;
      excerpt?: any | null;
      intro?: any | null;
      imageUrl?: any | null;
      language: CollectionLanguage;
      status: CollectionStatus;
      authors: Array<{
        __typename?: 'CollectionAuthor';
        externalId: string;
        name: string;
        slug?: string | null;
        bio?: any | null;
        imageUrl?: any | null;
        active: boolean;
      }>;
      curationCategory?: {
        __typename?: 'CurationCategory';
        externalId: string;
        name: string;
        slug: string;
      } | null;
      IABParentCategory?: {
        __typename?: 'IABCategory';
        externalId: string;
        name: string;
        slug: string;
      } | null;
      IABChildCategory?: {
        __typename?: 'IABCategory';
        externalId: string;
        name: string;
        slug: string;
      } | null;
      labels?: Array<{
        __typename?: 'Label';
        externalId: string;
        name: string;
      } | null> | null;
      partnership?: {
        __typename?: 'CollectionPartnership';
        externalId: string;
        type: CollectionPartnershipType;
        name: string;
        url: any;
        imageUrl: any;
        blurb: any;
      } | null;
    }>;
    pagination: {
      __typename?: 'Pagination';
      currentPage: number;
      totalPages: number;
      totalResults: number;
    };
  };
};

export type GetInitialCollectionFormDataQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
}>;

export type GetInitialCollectionFormDataQuery = {
  __typename?: 'Query';
  getLanguages: Array<CollectionLanguage>;
  getCollectionAuthors: {
    __typename?: 'CollectionAuthorsResult';
    authors: Array<{
      __typename?: 'CollectionAuthor';
      externalId: string;
      name: string;
      slug?: string | null;
      bio?: any | null;
      imageUrl?: any | null;
      active: boolean;
    }>;
  };
  labels: Array<{ __typename?: 'Label'; externalId: string; name: string }>;
  getCurationCategories: Array<{
    __typename?: 'CurationCategory';
    externalId: string;
    name: string;
    slug: string;
  }>;
  getIABCategories: Array<{
    __typename?: 'IABParentCategory';
    externalId: string;
    name: string;
    slug: string;
    children: Array<{
      __typename?: 'IABCategory';
      externalId: string;
      name: string;
      slug: string;
    }>;
  }>;
};

export type GetOpenGraphFieldsQueryVariables = Exact<{
  url: Scalars['Url'];
}>;

export type GetOpenGraphFieldsQuery = {
  __typename?: 'Query';
  getOpenGraphFields?: {
    __typename?: 'OpenGraphFields';
    description: string;
  } | null;
};

export type GetProspectsQueryVariables = Exact<{
  scheduledSurfaceGuid: Scalars['String'];
  prospectType?: InputMaybe<Scalars['String']>;
  historyFilter?: InputMaybe<ApprovedCorpusItemScheduledSurfaceHistoryFilters>;
}>;

export type GetProspectsQuery = {
  __typename?: 'Query';
  getProspects: Array<{
    __typename?: 'Prospect';
    id: string;
    prospectId: string;
    scheduledSurfaceGuid: string;
    topic?: string | null;
    prospectType: string;
    url: string;
    createdAt?: number | null;
    imageUrl?: string | null;
    authors?: string | null;
    publisher?: string | null;
    domain?: string | null;
    title?: string | null;
    excerpt?: string | null;
    language?: CorpusLanguage | null;
    saveCount?: number | null;
    isSyndicated?: boolean | null;
    isCollection?: boolean | null;
    approvedCorpusItem?: {
      __typename?: 'ApprovedCorpusItem';
      externalId: string;
      prospectId?: string | null;
      title: string;
      language: CorpusLanguage;
      publisher: string;
      url: any;
      hasTrustedDomain: boolean;
      imageUrl: any;
      excerpt: string;
      status: CuratedStatus;
      source: CorpusItemSource;
      topic: string;
      isCollection: boolean;
      isTimeSensitive: boolean;
      isSyndicated: boolean;
      createdBy: string;
      createdAt: number;
      updatedBy?: string | null;
      updatedAt: number;
      authors: Array<{
        __typename?: 'CorpusItemAuthor';
        name: string;
        sortOrder: number;
      }>;
      scheduledSurfaceHistory: Array<{
        __typename?: 'ApprovedCorpusItemScheduledSurfaceHistory';
        externalId: string;
        createdBy: string;
        scheduledDate: any;
        scheduledSurfaceGuid: string;
      }>;
    } | null;
    rejectedCorpusItem?: {
      __typename?: 'RejectedCorpusItem';
      externalId: string;
      prospectId?: string | null;
      url: any;
      title?: string | null;
      topic?: string | null;
      language?: CorpusLanguage | null;
      publisher?: string | null;
      reason: string;
      createdBy: string;
      createdAt: number;
    } | null;
    item?: {
      __typename?: 'Item';
      givenUrl: any;
      itemId: string;
      normalUrl: string;
      datePublished?: any | null;
      timeToRead?: number | null;
    } | null;
  }>;
};

export type GetRejectedItemsQueryVariables = Exact<{
  filters?: InputMaybe<RejectedCorpusItemFilter>;
  pagination?: InputMaybe<PaginationInput>;
}>;

export type GetRejectedItemsQuery = {
  __typename?: 'Query';
  getRejectedCorpusItems: {
    __typename?: 'RejectedCorpusItemConnection';
    totalCount: number;
    pageInfo: {
      __typename?: 'PageInfo';
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
    };
    edges: Array<{
      __typename?: 'RejectedCorpusItemEdge';
      cursor: string;
      node: {
        __typename?: 'RejectedCorpusItem';
        externalId: string;
        prospectId?: string | null;
        url: any;
        title?: string | null;
        topic?: string | null;
        language?: CorpusLanguage | null;
        publisher?: string | null;
        reason: string;
        createdBy: string;
        createdAt: number;
      };
    }>;
  };
};

export type GetScheduledItemCountsQueryVariables = Exact<{
  filters: ScheduledCorpusItemsFilterInput;
}>;

export type GetScheduledItemCountsQuery = {
  __typename?: 'Query';
  getScheduledCorpusItems: Array<{
    __typename?: 'ScheduledCorpusItemsResult';
    collectionCount: number;
    syndicatedCount: number;
    totalCount: number;
  }>;
};

export type GetScheduledItemsQueryVariables = Exact<{
  filters: ScheduledCorpusItemsFilterInput;
}>;

export type GetScheduledItemsQuery = {
  __typename?: 'Query';
  getScheduledCorpusItems: Array<{
    __typename?: 'ScheduledCorpusItemsResult';
    collectionCount: number;
    syndicatedCount: number;
    totalCount: number;
    scheduledDate: any;
    items: Array<{
      __typename?: 'ScheduledCorpusItem';
      scheduledSurfaceGuid: string;
      createdAt: number;
      createdBy: string;
      externalId: string;
      scheduledDate: any;
      updatedAt: number;
      updatedBy?: string | null;
      source: ActivitySource;
      approvedItem: {
        __typename?: 'ApprovedCorpusItem';
        externalId: string;
        prospectId?: string | null;
        title: string;
        language: CorpusLanguage;
        publisher: string;
        datePublished?: any | null;
        url: any;
        hasTrustedDomain: boolean;
        imageUrl: any;
        excerpt: string;
        status: CuratedStatus;
        source: CorpusItemSource;
        topic: string;
        isCollection: boolean;
        isTimeSensitive: boolean;
        isSyndicated: boolean;
        createdBy: string;
        createdAt: number;
        updatedBy?: string | null;
        updatedAt: number;
        authors: Array<{
          __typename?: 'CorpusItemAuthor';
          name: string;
          sortOrder: number;
        }>;
        scheduledSurfaceHistory: Array<{
          __typename?: 'ApprovedCorpusItemScheduledSurfaceHistory';
          externalId: string;
          createdBy: string;
          scheduledDate: any;
          scheduledSurfaceGuid: string;
        }>;
      };
    }>;
  }>;
};

export type GetScheduledSurfacesForUserQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetScheduledSurfacesForUserQuery = {
  __typename?: 'Query';
  getScheduledSurfacesForUser: Array<{
    __typename?: 'ScheduledSurface';
    guid: string;
    name: string;
    prospectTypes: Array<ProspectType>;
    ianaTimezone: string;
  }>;
};

export type SearchCollectionsQueryVariables = Exact<{
  filters: SearchCollectionsFilters;
  page?: InputMaybe<Scalars['Int']>;
  perPage?: InputMaybe<Scalars['Int']>;
}>;

export type SearchCollectionsQuery = {
  __typename?: 'Query';
  searchCollections: {
    __typename?: 'CollectionsResult';
    collections: Array<{
      __typename?: 'Collection';
      externalId: string;
      title: string;
      slug: string;
      excerpt?: any | null;
      intro?: any | null;
      imageUrl?: any | null;
      language: CollectionLanguage;
      status: CollectionStatus;
      authors: Array<{
        __typename?: 'CollectionAuthor';
        externalId: string;
        name: string;
        slug?: string | null;
        bio?: any | null;
        imageUrl?: any | null;
        active: boolean;
      }>;
      curationCategory?: {
        __typename?: 'CurationCategory';
        externalId: string;
        name: string;
        slug: string;
      } | null;
      IABParentCategory?: {
        __typename?: 'IABCategory';
        externalId: string;
        name: string;
        slug: string;
      } | null;
      IABChildCategory?: {
        __typename?: 'IABCategory';
        externalId: string;
        name: string;
        slug: string;
      } | null;
      labels?: Array<{
        __typename?: 'Label';
        externalId: string;
        name: string;
      } | null> | null;
      partnership?: {
        __typename?: 'CollectionPartnership';
        externalId: string;
        type: CollectionPartnershipType;
        name: string;
        url: any;
        imageUrl: any;
        blurb: any;
      } | null;
    }>;
    pagination: {
      __typename?: 'Pagination';
      currentPage: number;
      totalPages: number;
      totalResults: number;
      perPage: number;
    };
  };
};

export type GetSectionsWithSectionItemsQueryVariables = Exact<{
  scheduledSurfaceGuid: Scalars['ID'];
  createSource?: InputMaybe<ActivitySource>;
}>;

export type GetSectionsWithSectionItemsQuery = {
  __typename?: 'Query';
  getSectionsWithSectionItems: Array<{
    __typename?: 'Section';
    createdAt: number;
    updatedAt: number;
    externalId: string;
    title: string;
    scheduledSurfaceGuid: string;
    sort?: number | null;
    createSource: ActivitySource;
    disabled: boolean;
    active: boolean;
    description?: string | null;
    heroTitle?: string | null;
    heroDescription?: string | null;
    startDate?: any | null;
    endDate?: any | null;
    status: SectionStatus;
    sectionItems: Array<{
      __typename?: 'SectionItem';
      createdAt: number;
      updatedAt: number;
      externalId: string;
      rank?: number | null;
      approvedItem: {
        __typename?: 'ApprovedCorpusItem';
        externalId: string;
        prospectId?: string | null;
        title: string;
        language: CorpusLanguage;
        publisher: string;
        datePublished?: any | null;
        url: any;
        hasTrustedDomain: boolean;
        imageUrl: any;
        excerpt: string;
        status: CuratedStatus;
        source: CorpusItemSource;
        topic: string;
        isCollection: boolean;
        isTimeSensitive: boolean;
        isSyndicated: boolean;
        createdBy: string;
        createdAt: number;
        updatedBy?: string | null;
        updatedAt: number;
        authors: Array<{
          __typename?: 'CorpusItemAuthor';
          name: string;
          sortOrder: number;
        }>;
        scheduledSurfaceHistory: Array<{
          __typename?: 'ApprovedCorpusItemScheduledSurfaceHistory';
          externalId: string;
          createdBy: string;
          scheduledDate: any;
          scheduledSurfaceGuid: string;
        }>;
      };
    }>;
    iab?: {
      __typename?: 'IABMetadata';
      taxonomy: string;
      categories: Array<string>;
    } | null;
  }>;
};

export type GetStoryFromParserQueryVariables = Exact<{
  url: Scalars['String'];
}>;

export type GetStoryFromParserQuery = {
  __typename?: 'Query';
  getItemByUrl?: {
    __typename?: 'Item';
    resolvedUrl?: any | null;
    title?: string | null;
    excerpt?: string | null;
    topImageUrl?: any | null;
    images?: Array<{
      __typename?: 'Image';
      src: string;
      width?: number | null;
      height?: number | null;
    } | null> | null;
    authors?: Array<{
      __typename?: 'Author';
      name?: string | null;
    } | null> | null;
    domainMetadata?: {
      __typename?: 'DomainMetadata';
      name?: string | null;
    } | null;
  } | null;
};

export type GetUrlMetadataQueryVariables = Exact<{
  url: Scalars['String'];
}>;

export type GetUrlMetadataQuery = {
  __typename?: 'Query';
  getUrlMetadata: {
    __typename?: 'UrlMetadata';
    url: string;
    imageUrl?: string | null;
    publisher?: string | null;
    datePublished?: string | null;
    domain?: string | null;
    title?: string | null;
    excerpt?: string | null;
    language?: string | null;
    isSyndicated?: boolean | null;
    isCollection?: boolean | null;
    authors?: string | null;
  };
};

export type LabelsQueryVariables = Exact<{ [key: string]: never }>;

export type LabelsQuery = {
  __typename?: 'Query';
  labels: Array<{ __typename?: 'Label'; externalId: string; name: string }>;
};

export type SearchShareableListQueryVariables = Exact<{
  externalId: Scalars['ID'];
}>;

export type SearchShareableListQuery = {
  __typename?: 'Query';
  searchShareableList?: {
    __typename?: 'ShareableListComplete';
    externalId: string;
    title: string;
    description?: string | null;
    slug?: string | null;
    status: ShareableListVisibility;
    moderationStatus: ShareableListModerationStatus;
    createdAt: any;
    updatedAt: any;
    moderatedBy?: string | null;
    moderationReason?: ShareableListModerationReason | null;
    moderationDetails?: string | null;
    restorationReason?: string | null;
    listItemNoteVisibility: ShareableListVisibility;
    listItems: Array<{
      __typename?: 'ShareableListItem';
      externalId: string;
      itemId: string;
      url: any;
      title?: string | null;
      excerpt?: string | null;
      imageUrl?: any | null;
      publisher?: string | null;
      authors?: string | null;
      note?: string | null;
      sortOrder: number;
      createdAt: any;
      updatedAt: any;
    }>;
    user: { __typename?: 'User'; id: string };
  } | null;
};

export const CollectionAuthorDataFragmentDoc = gql`
  fragment CollectionAuthorData on CollectionAuthor {
    externalId
    name
    slug
    bio
    imageUrl
    active
  }
`;
export const CollectionDataFragmentDoc = gql`
  fragment CollectionData on Collection {
    externalId
    title
    slug
    excerpt
    intro
    imageUrl
    language
    status
    authors {
      ...CollectionAuthorData
    }
    curationCategory {
      externalId
      name
      slug
    }
    IABParentCategory {
      externalId
      name
      slug
    }
    IABChildCategory {
      externalId
      name
      slug
    }
    labels {
      externalId
      name
    }
    partnership {
      externalId
      type
      name
      url
      imageUrl
      blurb
    }
  }
  ${CollectionAuthorDataFragmentDoc}
`;
export const CollectionPartnerDataFragmentDoc = gql`
  fragment CollectionPartnerData on CollectionPartner {
    externalId
    name
    url
    imageUrl
    blurb
  }
`;
export const CollectionPartnerAssociationDataFragmentDoc = gql`
  fragment CollectionPartnerAssociationData on CollectionPartnerAssociation {
    externalId
    type
    name
    url
    imageUrl
    blurb
    partner {
      ...CollectionPartnerData
    }
  }
  ${CollectionPartnerDataFragmentDoc}
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
    fromPartner
    sortOrder
  }
`;
export const BaseSectionDataFragmentDoc = gql`
  fragment BaseSectionData on Section {
    externalId
    title
    scheduledSurfaceGuid
    iab {
      taxonomy
      categories
    }
    sort
    createSource
    disabled
    active
    description
    heroTitle
    heroDescription
    startDate
    endDate
    status
  }
`;
export const BaseSectionItemDataFragmentDoc = gql`
  fragment BaseSectionItemData on SectionItem {
    externalId
    rank
  }
`;
export const CuratedItemDataFragmentDoc = gql`
  fragment CuratedItemData on ApprovedCorpusItem {
    externalId
    prospectId
    title
    language
    publisher
    datePublished
    authors {
      name
      sortOrder
    }
    url
    hasTrustedDomain
    imageUrl
    excerpt
    status
    source
    topic
    isCollection
    isTimeSensitive
    isSyndicated
    createdBy
    createdAt
    updatedBy
    updatedAt
    scheduledSurfaceHistory {
      externalId
      createdBy
      scheduledDate
      scheduledSurfaceGuid
    }
  }
`;
export const SectionItemDataFragmentDoc = gql`
  fragment SectionItemData on SectionItem {
    ...BaseSectionItemData
    approvedItem {
      ...CuratedItemData
    }
    createdAt
    updatedAt
  }
  ${BaseSectionItemDataFragmentDoc}
  ${CuratedItemDataFragmentDoc}
`;
export const SectionDataFragmentDoc = gql`
  fragment SectionData on Section {
    ...BaseSectionData
    sectionItems {
      ...SectionItemData
    }
    createdAt
    updatedAt
  }
  ${BaseSectionDataFragmentDoc}
  ${SectionItemDataFragmentDoc}
`;
export const ShareableListItemPropsFragmentDoc = gql`
  fragment ShareableListItemProps on ShareableListItem {
    externalId
    itemId
    url
    title
    excerpt
    imageUrl
    publisher
    authors
    note
    sortOrder
    createdAt
    updatedAt
  }
`;
export const ShareableListCompletePropsFragmentDoc = gql`
  fragment ShareableListCompleteProps on ShareableListComplete {
    externalId
    title
    description
    slug
    status
    moderationStatus
    createdAt
    updatedAt
    moderatedBy
    moderationReason
    moderationDetails
    restorationReason
    listItemNoteVisibility
    listItems {
      ...ShareableListItemProps
    }
    user {
      id
    }
  }
  ${ShareableListItemPropsFragmentDoc}
`;
export const ProspectDataFragmentDoc = gql`
  fragment ProspectData on Prospect {
    id
    prospectId
    scheduledSurfaceGuid
    topic
    prospectType
    url
    createdAt
    imageUrl
    authors
    publisher
    domain
    title
    excerpt
    language
    saveCount
    isSyndicated
    isCollection
  }
`;
export const CuratedItemDataWithHistoryFragmentDoc = gql`
  fragment CuratedItemDataWithHistory on ApprovedCorpusItem {
    externalId
    prospectId
    title
    language
    publisher
    authors {
      name
      sortOrder
    }
    url
    hasTrustedDomain
    imageUrl
    excerpt
    status
    source
    topic
    isCollection
    isTimeSensitive
    isSyndicated
    createdBy
    createdAt
    updatedBy
    updatedAt
    scheduledSurfaceHistory(filters: $historyFilter) {
      externalId
      createdBy
      scheduledDate
      scheduledSurfaceGuid
    }
  }
`;
export const RejectedItemDataFragmentDoc = gql`
  fragment RejectedItemData on RejectedCorpusItem {
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
export const BasicParserItemDataFragmentDoc = gql`
  fragment BasicParserItemData on Item {
    givenUrl
    itemId
    normalUrl
    datePublished
    timeToRead
  }
`;
export const ProspectDataWithCorpusItemsFragmentDoc = gql`
  fragment ProspectDataWithCorpusItems on Prospect {
    id
    prospectId
    scheduledSurfaceGuid
    topic
    prospectType
    url
    createdAt
    imageUrl
    authors
    publisher
    domain
    title
    excerpt
    language
    saveCount
    isSyndicated
    isCollection
    approvedCorpusItem {
      ...CuratedItemDataWithHistory
    }
    rejectedCorpusItem {
      ...RejectedItemData
    }
    item {
      ...BasicParserItemData
    }
  }
  ${CuratedItemDataWithHistoryFragmentDoc}
  ${RejectedItemDataFragmentDoc}
  ${BasicParserItemDataFragmentDoc}
`;
export const ScheduledItemDataFragmentDoc = gql`
  fragment ScheduledItemData on ScheduledCorpusItem {
    approvedItem {
      ...CuratedItemData
    }
    scheduledSurfaceGuid
    createdAt
    createdBy
    externalId
    scheduledDate
    updatedAt
    updatedBy
    source
  }
  ${CuratedItemDataFragmentDoc}
`;
export const UrlMetadataFragmentDoc = gql`
  fragment urlMetadata on UrlMetadata {
    url
    imageUrl
    publisher
    datePublished
    domain
    title
    excerpt
    language
    isSyndicated
    isCollection
    authors
  }
`;
export const CreateApprovedCorpusItemDocument = gql`
  mutation createApprovedCorpusItem($data: CreateApprovedCorpusItemInput!) {
    createApprovedCorpusItem(data: $data) {
      ...CuratedItemData
    }
  }
  ${CuratedItemDataFragmentDoc}
`;
export type CreateApprovedCorpusItemMutationFn = Apollo.MutationFunction<
  CreateApprovedCorpusItemMutation,
  CreateApprovedCorpusItemMutationVariables
>;

/**
 * __useCreateApprovedCorpusItemMutation__
 *
 * To run a mutation, you first call `useCreateApprovedCorpusItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateApprovedCorpusItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createApprovedCorpusItemMutation, { data, loading, error }] = useCreateApprovedCorpusItemMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateApprovedCorpusItemMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateApprovedCorpusItemMutation,
    CreateApprovedCorpusItemMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateApprovedCorpusItemMutation,
    CreateApprovedCorpusItemMutationVariables
  >(CreateApprovedCorpusItemDocument, options);
}
export type CreateApprovedCorpusItemMutationHookResult = ReturnType<
  typeof useCreateApprovedCorpusItemMutation
>;
export type CreateApprovedCorpusItemMutationResult =
  Apollo.MutationResult<CreateApprovedCorpusItemMutation>;
export type CreateApprovedCorpusItemMutationOptions =
  Apollo.BaseMutationOptions<
    CreateApprovedCorpusItemMutation,
    CreateApprovedCorpusItemMutationVariables
  >;
export const CreateCollectionDocument = gql`
  mutation createCollection($data: CreateCollectionInput!) {
    createCollection(data: $data) {
      ...CollectionData
    }
  }
  ${CollectionDataFragmentDoc}
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
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateCollectionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateCollectionMutation,
    CreateCollectionMutationVariables
  >,
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
export type CreateCollectionMutationResult =
  Apollo.MutationResult<CreateCollectionMutation>;
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
      ...CollectionAuthorData
    }
  }
  ${CollectionAuthorDataFragmentDoc}
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
  >,
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
export type CreateCollectionAuthorMutationResult =
  Apollo.MutationResult<CreateCollectionAuthorMutation>;
export type CreateCollectionAuthorMutationOptions = Apollo.BaseMutationOptions<
  CreateCollectionAuthorMutation,
  CreateCollectionAuthorMutationVariables
>;
export const CreateCollectionPartnerDocument = gql`
  mutation createCollectionPartner(
    $name: String!
    $url: Url!
    $blurb: Markdown!
    $imageUrl: Url!
  ) {
    createCollectionPartner(
      data: { name: $name, url: $url, blurb: $blurb, imageUrl: $imageUrl }
    ) {
      ...CollectionPartnerData
    }
  }
  ${CollectionPartnerDataFragmentDoc}
`;
export type CreateCollectionPartnerMutationFn = Apollo.MutationFunction<
  CreateCollectionPartnerMutation,
  CreateCollectionPartnerMutationVariables
>;

/**
 * __useCreateCollectionPartnerMutation__
 *
 * To run a mutation, you first call `useCreateCollectionPartnerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCollectionPartnerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCollectionPartnerMutation, { data, loading, error }] = useCreateCollectionPartnerMutation({
 *   variables: {
 *      name: // value for 'name'
 *      url: // value for 'url'
 *      blurb: // value for 'blurb'
 *      imageUrl: // value for 'imageUrl'
 *   },
 * });
 */
export function useCreateCollectionPartnerMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateCollectionPartnerMutation,
    CreateCollectionPartnerMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateCollectionPartnerMutation,
    CreateCollectionPartnerMutationVariables
  >(CreateCollectionPartnerDocument, options);
}
export type CreateCollectionPartnerMutationHookResult = ReturnType<
  typeof useCreateCollectionPartnerMutation
>;
export type CreateCollectionPartnerMutationResult =
  Apollo.MutationResult<CreateCollectionPartnerMutation>;
export type CreateCollectionPartnerMutationOptions = Apollo.BaseMutationOptions<
  CreateCollectionPartnerMutation,
  CreateCollectionPartnerMutationVariables
>;
export const CreateCollectionPartnerAssociationDocument = gql`
  mutation createCollectionPartnerAssociation(
    $type: CollectionPartnershipType!
    $partnerExternalId: String!
    $collectionExternalId: String!
    $name: String
    $url: Url
    $imageUrl: Url
    $blurb: Markdown
  ) {
    createCollectionPartnerAssociation(
      data: {
        type: $type
        partnerExternalId: $partnerExternalId
        collectionExternalId: $collectionExternalId
        name: $name
        url: $url
        imageUrl: $imageUrl
        blurb: $blurb
      }
    ) {
      ...CollectionPartnerAssociationData
    }
  }
  ${CollectionPartnerAssociationDataFragmentDoc}
`;
export type CreateCollectionPartnerAssociationMutationFn =
  Apollo.MutationFunction<
    CreateCollectionPartnerAssociationMutation,
    CreateCollectionPartnerAssociationMutationVariables
  >;

/**
 * __useCreateCollectionPartnerAssociationMutation__
 *
 * To run a mutation, you first call `useCreateCollectionPartnerAssociationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCollectionPartnerAssociationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCollectionPartnerAssociationMutation, { data, loading, error }] = useCreateCollectionPartnerAssociationMutation({
 *   variables: {
 *      type: // value for 'type'
 *      partnerExternalId: // value for 'partnerExternalId'
 *      collectionExternalId: // value for 'collectionExternalId'
 *      name: // value for 'name'
 *      url: // value for 'url'
 *      imageUrl: // value for 'imageUrl'
 *      blurb: // value for 'blurb'
 *   },
 * });
 */
export function useCreateCollectionPartnerAssociationMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateCollectionPartnerAssociationMutation,
    CreateCollectionPartnerAssociationMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateCollectionPartnerAssociationMutation,
    CreateCollectionPartnerAssociationMutationVariables
  >(CreateCollectionPartnerAssociationDocument, options);
}
export type CreateCollectionPartnerAssociationMutationHookResult = ReturnType<
  typeof useCreateCollectionPartnerAssociationMutation
>;
export type CreateCollectionPartnerAssociationMutationResult =
  Apollo.MutationResult<CreateCollectionPartnerAssociationMutation>;
export type CreateCollectionPartnerAssociationMutationOptions =
  Apollo.BaseMutationOptions<
    CreateCollectionPartnerAssociationMutation,
    CreateCollectionPartnerAssociationMutationVariables
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
    $fromPartner: Boolean
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
        fromPartner: $fromPartner
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
 *      fromPartner: // value for 'fromPartner'
 *   },
 * });
 */
export function useCreateCollectionStoryMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateCollectionStoryMutation,
    CreateCollectionStoryMutationVariables
  >,
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
export type CreateCollectionStoryMutationResult =
  Apollo.MutationResult<CreateCollectionStoryMutation>;
export type CreateCollectionStoryMutationOptions = Apollo.BaseMutationOptions<
  CreateCollectionStoryMutation,
  CreateCollectionStoryMutationVariables
>;
export const CreateCustomSectionDocument = gql`
  mutation createCustomSection($data: CreateCustomSectionInput!) {
    createCustomSection(data: $data) {
      ...BaseSectionData
    }
  }
  ${BaseSectionDataFragmentDoc}
`;
export type CreateCustomSectionMutationFn = Apollo.MutationFunction<
  CreateCustomSectionMutation,
  CreateCustomSectionMutationVariables
>;

/**
 * __useCreateCustomSectionMutation__
 *
 * To run a mutation, you first call `useCreateCustomSectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateCustomSectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createCustomSectionMutation, { data, loading, error }] = useCreateCustomSectionMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateCustomSectionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateCustomSectionMutation,
    CreateCustomSectionMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateCustomSectionMutation,
    CreateCustomSectionMutationVariables
  >(CreateCustomSectionDocument, options);
}
export type CreateCustomSectionMutationHookResult = ReturnType<
  typeof useCreateCustomSectionMutation
>;
export type CreateCustomSectionMutationResult =
  Apollo.MutationResult<CreateCustomSectionMutation>;
export type CreateCustomSectionMutationOptions = Apollo.BaseMutationOptions<
  CreateCustomSectionMutation,
  CreateCustomSectionMutationVariables
>;
export const CreateLabelDocument = gql`
  mutation createLabel($name: String!) {
    createLabel(name: $name) {
      externalId
      name
    }
  }
`;
export type CreateLabelMutationFn = Apollo.MutationFunction<
  CreateLabelMutation,
  CreateLabelMutationVariables
>;

/**
 * __useCreateLabelMutation__
 *
 * To run a mutation, you first call `useCreateLabelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateLabelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createLabelMutation, { data, loading, error }] = useCreateLabelMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateLabelMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateLabelMutation,
    CreateLabelMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<CreateLabelMutation, CreateLabelMutationVariables>(
    CreateLabelDocument,
    options,
  );
}
export type CreateLabelMutationHookResult = ReturnType<
  typeof useCreateLabelMutation
>;
export type CreateLabelMutationResult =
  Apollo.MutationResult<CreateLabelMutation>;
export type CreateLabelMutationOptions = Apollo.BaseMutationOptions<
  CreateLabelMutation,
  CreateLabelMutationVariables
>;
export const CreateScheduledCorpusItemDocument = gql`
  mutation createScheduledCorpusItem(
    $approvedItemExternalId: ID!
    $scheduledSurfaceGuid: ID!
    $scheduledDate: Date!
    $source: ActivitySource!
    $reasons: String
    $reasonComment: String
    $actionScreen: ActionScreen
  ) {
    createScheduledCorpusItem(
      data: {
        approvedItemExternalId: $approvedItemExternalId
        scheduledSurfaceGuid: $scheduledSurfaceGuid
        scheduledDate: $scheduledDate
        source: $source
        reasons: $reasons
        reasonComment: $reasonComment
        actionScreen: $actionScreen
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
export type CreateScheduledCorpusItemMutationFn = Apollo.MutationFunction<
  CreateScheduledCorpusItemMutation,
  CreateScheduledCorpusItemMutationVariables
>;

/**
 * __useCreateScheduledCorpusItemMutation__
 *
 * To run a mutation, you first call `useCreateScheduledCorpusItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateScheduledCorpusItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createScheduledCorpusItemMutation, { data, loading, error }] = useCreateScheduledCorpusItemMutation({
 *   variables: {
 *      approvedItemExternalId: // value for 'approvedItemExternalId'
 *      scheduledSurfaceGuid: // value for 'scheduledSurfaceGuid'
 *      scheduledDate: // value for 'scheduledDate'
 *      source: // value for 'source'
 *      reasons: // value for 'reasons'
 *      reasonComment: // value for 'reasonComment'
 *      actionScreen: // value for 'actionScreen'
 *   },
 * });
 */
export function useCreateScheduledCorpusItemMutation(
  baseOptions?: Apollo.MutationHookOptions<
    CreateScheduledCorpusItemMutation,
    CreateScheduledCorpusItemMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    CreateScheduledCorpusItemMutation,
    CreateScheduledCorpusItemMutationVariables
  >(CreateScheduledCorpusItemDocument, options);
}
export type CreateScheduledCorpusItemMutationHookResult = ReturnType<
  typeof useCreateScheduledCorpusItemMutation
>;
export type CreateScheduledCorpusItemMutationResult =
  Apollo.MutationResult<CreateScheduledCorpusItemMutation>;
export type CreateScheduledCorpusItemMutationOptions =
  Apollo.BaseMutationOptions<
    CreateScheduledCorpusItemMutation,
    CreateScheduledCorpusItemMutationVariables
  >;
export const DeleteCollectionPartnerAssociationDocument = gql`
  mutation deleteCollectionPartnerAssociation($externalId: String!) {
    deleteCollectionPartnerAssociation(externalId: $externalId) {
      ...CollectionPartnerAssociationData
    }
  }
  ${CollectionPartnerAssociationDataFragmentDoc}
`;
export type DeleteCollectionPartnerAssociationMutationFn =
  Apollo.MutationFunction<
    DeleteCollectionPartnerAssociationMutation,
    DeleteCollectionPartnerAssociationMutationVariables
  >;

/**
 * __useDeleteCollectionPartnerAssociationMutation__
 *
 * To run a mutation, you first call `useDeleteCollectionPartnerAssociationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteCollectionPartnerAssociationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteCollectionPartnerAssociationMutation, { data, loading, error }] = useDeleteCollectionPartnerAssociationMutation({
 *   variables: {
 *      externalId: // value for 'externalId'
 *   },
 * });
 */
export function useDeleteCollectionPartnerAssociationMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteCollectionPartnerAssociationMutation,
    DeleteCollectionPartnerAssociationMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    DeleteCollectionPartnerAssociationMutation,
    DeleteCollectionPartnerAssociationMutationVariables
  >(DeleteCollectionPartnerAssociationDocument, options);
}
export type DeleteCollectionPartnerAssociationMutationHookResult = ReturnType<
  typeof useDeleteCollectionPartnerAssociationMutation
>;
export type DeleteCollectionPartnerAssociationMutationResult =
  Apollo.MutationResult<DeleteCollectionPartnerAssociationMutation>;
export type DeleteCollectionPartnerAssociationMutationOptions =
  Apollo.BaseMutationOptions<
    DeleteCollectionPartnerAssociationMutation,
    DeleteCollectionPartnerAssociationMutationVariables
  >;
export const DeleteCollectionStoryDocument = gql`
  mutation deleteCollectionStory($externalId: String!) {
    deleteCollectionStory(externalId: $externalId) {
      ...CollectionStoryData
    }
  }
  ${CollectionStoryDataFragmentDoc}
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
  >,
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
export type DeleteCollectionStoryMutationResult =
  Apollo.MutationResult<DeleteCollectionStoryMutation>;
export type DeleteCollectionStoryMutationOptions = Apollo.BaseMutationOptions<
  DeleteCollectionStoryMutation,
  DeleteCollectionStoryMutationVariables
>;
export const DeleteScheduledItemDocument = gql`
  mutation deleteScheduledItem($data: DeleteScheduledCorpusItemInput!) {
    deleteScheduledCorpusItem(data: $data) {
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
export type DeleteScheduledItemMutationFn = Apollo.MutationFunction<
  DeleteScheduledItemMutation,
  DeleteScheduledItemMutationVariables
>;

/**
 * __useDeleteScheduledItemMutation__
 *
 * To run a mutation, you first call `useDeleteScheduledItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteScheduledItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteScheduledItemMutation, { data, loading, error }] = useDeleteScheduledItemMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useDeleteScheduledItemMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DeleteScheduledItemMutation,
    DeleteScheduledItemMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    DeleteScheduledItemMutation,
    DeleteScheduledItemMutationVariables
  >(DeleteScheduledItemDocument, options);
}
export type DeleteScheduledItemMutationHookResult = ReturnType<
  typeof useDeleteScheduledItemMutation
>;
export type DeleteScheduledItemMutationResult =
  Apollo.MutationResult<DeleteScheduledItemMutation>;
export type DeleteScheduledItemMutationOptions = Apollo.BaseMutationOptions<
  DeleteScheduledItemMutation,
  DeleteScheduledItemMutationVariables
>;
export const DisableEnableSectionDocument = gql`
  mutation disableEnableSection($data: DisableEnableSectionInput!) {
    disableEnableSection(data: $data) {
      ...SectionData
    }
  }
  ${SectionDataFragmentDoc}
`;
export type DisableEnableSectionMutationFn = Apollo.MutationFunction<
  DisableEnableSectionMutation,
  DisableEnableSectionMutationVariables
>;

/**
 * __useDisableEnableSectionMutation__
 *
 * To run a mutation, you first call `useDisableEnableSectionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDisableEnableSectionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [disableEnableSectionMutation, { data, loading, error }] = useDisableEnableSectionMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useDisableEnableSectionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    DisableEnableSectionMutation,
    DisableEnableSectionMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    DisableEnableSectionMutation,
    DisableEnableSectionMutationVariables
  >(DisableEnableSectionDocument, options);
}
export type DisableEnableSectionMutationHookResult = ReturnType<
  typeof useDisableEnableSectionMutation
>;
export type DisableEnableSectionMutationResult =
  Apollo.MutationResult<DisableEnableSectionMutation>;
export type DisableEnableSectionMutationOptions = Apollo.BaseMutationOptions<
  DisableEnableSectionMutation,
  DisableEnableSectionMutationVariables
>;
export const ImageUploadDocument = gql`
  mutation imageUpload(
    $image: Upload!
    $width: Int!
    $height: Int!
    $fileSizeBytes: Int!
  ) {
    collectionImageUpload(
      data: {
        image: $image
        width: $width
        height: $height
        fileSizeBytes: $fileSizeBytes
      }
    ) {
      url
    }
  }
`;
export type ImageUploadMutationFn = Apollo.MutationFunction<
  ImageUploadMutation,
  ImageUploadMutationVariables
>;

/**
 * __useImageUploadMutation__
 *
 * To run a mutation, you first call `useImageUploadMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useImageUploadMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [imageUploadMutation, { data, loading, error }] = useImageUploadMutation({
 *   variables: {
 *      image: // value for 'image'
 *      width: // value for 'width'
 *      height: // value for 'height'
 *      fileSizeBytes: // value for 'fileSizeBytes'
 *   },
 * });
 */
export function useImageUploadMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ImageUploadMutation,
    ImageUploadMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<ImageUploadMutation, ImageUploadMutationVariables>(
    ImageUploadDocument,
    options,
  );
}
export type ImageUploadMutationHookResult = ReturnType<
  typeof useImageUploadMutation
>;
export type ImageUploadMutationResult =
  Apollo.MutationResult<ImageUploadMutation>;
export type ImageUploadMutationOptions = Apollo.BaseMutationOptions<
  ImageUploadMutation,
  ImageUploadMutationVariables
>;
export const ModerateShareableListDocument = gql`
  mutation moderateShareableList($data: ModerateShareableListInput!) {
    moderateShareableList(data: $data) {
      ...ShareableListCompleteProps
    }
  }
  ${ShareableListCompletePropsFragmentDoc}
`;
export type ModerateShareableListMutationFn = Apollo.MutationFunction<
  ModerateShareableListMutation,
  ModerateShareableListMutationVariables
>;

/**
 * __useModerateShareableListMutation__
 *
 * To run a mutation, you first call `useModerateShareableListMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useModerateShareableListMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [moderateShareableListMutation, { data, loading, error }] = useModerateShareableListMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useModerateShareableListMutation(
  baseOptions?: Apollo.MutationHookOptions<
    ModerateShareableListMutation,
    ModerateShareableListMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    ModerateShareableListMutation,
    ModerateShareableListMutationVariables
  >(ModerateShareableListDocument, options);
}
export type ModerateShareableListMutationHookResult = ReturnType<
  typeof useModerateShareableListMutation
>;
export type ModerateShareableListMutationResult =
  Apollo.MutationResult<ModerateShareableListMutation>;
export type ModerateShareableListMutationOptions = Apollo.BaseMutationOptions<
  ModerateShareableListMutation,
  ModerateShareableListMutationVariables
>;
export const RejectApprovedItemDocument = gql`
  mutation rejectApprovedItem($data: RejectApprovedCorpusItemInput!) {
    rejectApprovedCorpusItem(data: $data) {
      ...CuratedItemData
    }
  }
  ${CuratedItemDataFragmentDoc}
`;
export type RejectApprovedItemMutationFn = Apollo.MutationFunction<
  RejectApprovedItemMutation,
  RejectApprovedItemMutationVariables
>;

/**
 * __useRejectApprovedItemMutation__
 *
 * To run a mutation, you first call `useRejectApprovedItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRejectApprovedItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [rejectApprovedItemMutation, { data, loading, error }] = useRejectApprovedItemMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useRejectApprovedItemMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RejectApprovedItemMutation,
    RejectApprovedItemMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    RejectApprovedItemMutation,
    RejectApprovedItemMutationVariables
  >(RejectApprovedItemDocument, options);
}
export type RejectApprovedItemMutationHookResult = ReturnType<
  typeof useRejectApprovedItemMutation
>;
export type RejectApprovedItemMutationResult =
  Apollo.MutationResult<RejectApprovedItemMutation>;
export type RejectApprovedItemMutationOptions = Apollo.BaseMutationOptions<
  RejectApprovedItemMutation,
  RejectApprovedItemMutationVariables
>;
export const RejectProspectDocument = gql`
  mutation rejectProspect($data: CreateRejectedCorpusItemInput!) {
    createRejectedCorpusItem(data: $data) {
      ...RejectedItemData
    }
  }
  ${RejectedItemDataFragmentDoc}
`;
export type RejectProspectMutationFn = Apollo.MutationFunction<
  RejectProspectMutation,
  RejectProspectMutationVariables
>;

/**
 * __useRejectProspectMutation__
 *
 * To run a mutation, you first call `useRejectProspectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRejectProspectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [rejectProspectMutation, { data, loading, error }] = useRejectProspectMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useRejectProspectMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RejectProspectMutation,
    RejectProspectMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    RejectProspectMutation,
    RejectProspectMutationVariables
  >(RejectProspectDocument, options);
}
export type RejectProspectMutationHookResult = ReturnType<
  typeof useRejectProspectMutation
>;
export type RejectProspectMutationResult =
  Apollo.MutationResult<RejectProspectMutation>;
export type RejectProspectMutationOptions = Apollo.BaseMutationOptions<
  RejectProspectMutation,
  RejectProspectMutationVariables
>;
export const RemoveProspectDocument = gql`
  mutation RemoveProspect($data: RemoveProspectInput!) {
    removeProspect(data: $data) {
      ...ProspectData
    }
  }
  ${ProspectDataFragmentDoc}
`;
export type RemoveProspectMutationFn = Apollo.MutationFunction<
  RemoveProspectMutation,
  RemoveProspectMutationVariables
>;

/**
 * __useRemoveProspectMutation__
 *
 * To run a mutation, you first call `useRemoveProspectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveProspectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeProspectMutation, { data, loading, error }] = useRemoveProspectMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useRemoveProspectMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RemoveProspectMutation,
    RemoveProspectMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    RemoveProspectMutation,
    RemoveProspectMutationVariables
  >(RemoveProspectDocument, options);
}
export type RemoveProspectMutationHookResult = ReturnType<
  typeof useRemoveProspectMutation
>;
export type RemoveProspectMutationResult =
  Apollo.MutationResult<RemoveProspectMutation>;
export type RemoveProspectMutationOptions = Apollo.BaseMutationOptions<
  RemoveProspectMutation,
  RemoveProspectMutationVariables
>;
export const RemoveSectionItemDocument = gql`
  mutation RemoveSectionItem($data: RemoveSectionItemInput!) {
    removeSectionItem(data: $data) {
      ...SectionItemData
    }
  }
  ${SectionItemDataFragmentDoc}
`;
export type RemoveSectionItemMutationFn = Apollo.MutationFunction<
  RemoveSectionItemMutation,
  RemoveSectionItemMutationVariables
>;

/**
 * __useRemoveSectionItemMutation__
 *
 * To run a mutation, you first call `useRemoveSectionItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveSectionItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeSectionItemMutation, { data, loading, error }] = useRemoveSectionItemMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useRemoveSectionItemMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RemoveSectionItemMutation,
    RemoveSectionItemMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    RemoveSectionItemMutation,
    RemoveSectionItemMutationVariables
  >(RemoveSectionItemDocument, options);
}
export type RemoveSectionItemMutationHookResult = ReturnType<
  typeof useRemoveSectionItemMutation
>;
export type RemoveSectionItemMutationResult =
  Apollo.MutationResult<RemoveSectionItemMutation>;
export type RemoveSectionItemMutationOptions = Apollo.BaseMutationOptions<
  RemoveSectionItemMutation,
  RemoveSectionItemMutationVariables
>;
export const RescheduleScheduledCorpusItemDocument = gql`
  mutation rescheduleScheduledCorpusItem(
    $externalId: ID!
    $scheduledDate: Date!
    $source: ActivitySource!
    $actionScreen: ActionScreen
  ) {
    rescheduleScheduledCorpusItem(
      data: {
        externalId: $externalId
        scheduledDate: $scheduledDate
        source: $source
        actionScreen: $actionScreen
      }
    ) {
      ...ScheduledItemData
    }
  }
  ${ScheduledItemDataFragmentDoc}
`;
export type RescheduleScheduledCorpusItemMutationFn = Apollo.MutationFunction<
  RescheduleScheduledCorpusItemMutation,
  RescheduleScheduledCorpusItemMutationVariables
>;

/**
 * __useRescheduleScheduledCorpusItemMutation__
 *
 * To run a mutation, you first call `useRescheduleScheduledCorpusItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRescheduleScheduledCorpusItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [rescheduleScheduledCorpusItemMutation, { data, loading, error }] = useRescheduleScheduledCorpusItemMutation({
 *   variables: {
 *      externalId: // value for 'externalId'
 *      scheduledDate: // value for 'scheduledDate'
 *      source: // value for 'source'
 *      actionScreen: // value for 'actionScreen'
 *   },
 * });
 */
export function useRescheduleScheduledCorpusItemMutation(
  baseOptions?: Apollo.MutationHookOptions<
    RescheduleScheduledCorpusItemMutation,
    RescheduleScheduledCorpusItemMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    RescheduleScheduledCorpusItemMutation,
    RescheduleScheduledCorpusItemMutationVariables
  >(RescheduleScheduledCorpusItemDocument, options);
}
export type RescheduleScheduledCorpusItemMutationHookResult = ReturnType<
  typeof useRescheduleScheduledCorpusItemMutation
>;
export type RescheduleScheduledCorpusItemMutationResult =
  Apollo.MutationResult<RescheduleScheduledCorpusItemMutation>;
export type RescheduleScheduledCorpusItemMutationOptions =
  Apollo.BaseMutationOptions<
    RescheduleScheduledCorpusItemMutation,
    RescheduleScheduledCorpusItemMutationVariables
  >;
export const UpdateApprovedCorpusItemDocument = gql`
  mutation updateApprovedCorpusItem($data: UpdateApprovedCorpusItemInput!) {
    updateApprovedCorpusItem(data: $data) {
      ...CuratedItemData
    }
  }
  ${CuratedItemDataFragmentDoc}
`;
export type UpdateApprovedCorpusItemMutationFn = Apollo.MutationFunction<
  UpdateApprovedCorpusItemMutation,
  UpdateApprovedCorpusItemMutationVariables
>;

/**
 * __useUpdateApprovedCorpusItemMutation__
 *
 * To run a mutation, you first call `useUpdateApprovedCorpusItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateApprovedCorpusItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateApprovedCorpusItemMutation, { data, loading, error }] = useUpdateApprovedCorpusItemMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateApprovedCorpusItemMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateApprovedCorpusItemMutation,
    UpdateApprovedCorpusItemMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateApprovedCorpusItemMutation,
    UpdateApprovedCorpusItemMutationVariables
  >(UpdateApprovedCorpusItemDocument, options);
}
export type UpdateApprovedCorpusItemMutationHookResult = ReturnType<
  typeof useUpdateApprovedCorpusItemMutation
>;
export type UpdateApprovedCorpusItemMutationResult =
  Apollo.MutationResult<UpdateApprovedCorpusItemMutation>;
export type UpdateApprovedCorpusItemMutationOptions =
  Apollo.BaseMutationOptions<
    UpdateApprovedCorpusItemMutation,
    UpdateApprovedCorpusItemMutationVariables
  >;
export const UpdateCollectionDocument = gql`
  mutation updateCollection($data: UpdateCollectionInput!) {
    updateCollection(data: $data) {
      ...CollectionData
    }
  }
  ${CollectionDataFragmentDoc}
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
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateCollectionMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateCollectionMutation,
    UpdateCollectionMutationVariables
  >,
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
export type UpdateCollectionMutationResult =
  Apollo.MutationResult<UpdateCollectionMutation>;
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
      ...CollectionAuthorData
    }
  }
  ${CollectionAuthorDataFragmentDoc}
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
  >,
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
export type UpdateCollectionAuthorMutationResult =
  Apollo.MutationResult<UpdateCollectionAuthorMutation>;
export type UpdateCollectionAuthorMutationOptions = Apollo.BaseMutationOptions<
  UpdateCollectionAuthorMutation,
  UpdateCollectionAuthorMutationVariables
>;
export const UpdateCollectionAuthorImageUrlDocument = gql`
  mutation updateCollectionAuthorImageUrl(
    $externalId: String!
    $imageUrl: Url!
  ) {
    updateCollectionAuthorImageUrl(
      data: { externalId: $externalId, imageUrl: $imageUrl }
    ) {
      ...CollectionAuthorData
    }
  }
  ${CollectionAuthorDataFragmentDoc}
`;
export type UpdateCollectionAuthorImageUrlMutationFn = Apollo.MutationFunction<
  UpdateCollectionAuthorImageUrlMutation,
  UpdateCollectionAuthorImageUrlMutationVariables
>;

/**
 * __useUpdateCollectionAuthorImageUrlMutation__
 *
 * To run a mutation, you first call `useUpdateCollectionAuthorImageUrlMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCollectionAuthorImageUrlMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCollectionAuthorImageUrlMutation, { data, loading, error }] = useUpdateCollectionAuthorImageUrlMutation({
 *   variables: {
 *      externalId: // value for 'externalId'
 *      imageUrl: // value for 'imageUrl'
 *   },
 * });
 */
export function useUpdateCollectionAuthorImageUrlMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateCollectionAuthorImageUrlMutation,
    UpdateCollectionAuthorImageUrlMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateCollectionAuthorImageUrlMutation,
    UpdateCollectionAuthorImageUrlMutationVariables
  >(UpdateCollectionAuthorImageUrlDocument, options);
}
export type UpdateCollectionAuthorImageUrlMutationHookResult = ReturnType<
  typeof useUpdateCollectionAuthorImageUrlMutation
>;
export type UpdateCollectionAuthorImageUrlMutationResult =
  Apollo.MutationResult<UpdateCollectionAuthorImageUrlMutation>;
export type UpdateCollectionAuthorImageUrlMutationOptions =
  Apollo.BaseMutationOptions<
    UpdateCollectionAuthorImageUrlMutation,
    UpdateCollectionAuthorImageUrlMutationVariables
  >;
export const UpdateCollectionImageUrlDocument = gql`
  mutation updateCollectionImageUrl($externalId: String!, $imageUrl: Url!) {
    updateCollectionImageUrl(
      data: { externalId: $externalId, imageUrl: $imageUrl }
    ) {
      ...CollectionData
    }
  }
  ${CollectionDataFragmentDoc}
`;
export type UpdateCollectionImageUrlMutationFn = Apollo.MutationFunction<
  UpdateCollectionImageUrlMutation,
  UpdateCollectionImageUrlMutationVariables
>;

/**
 * __useUpdateCollectionImageUrlMutation__
 *
 * To run a mutation, you first call `useUpdateCollectionImageUrlMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCollectionImageUrlMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCollectionImageUrlMutation, { data, loading, error }] = useUpdateCollectionImageUrlMutation({
 *   variables: {
 *      externalId: // value for 'externalId'
 *      imageUrl: // value for 'imageUrl'
 *   },
 * });
 */
export function useUpdateCollectionImageUrlMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateCollectionImageUrlMutation,
    UpdateCollectionImageUrlMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateCollectionImageUrlMutation,
    UpdateCollectionImageUrlMutationVariables
  >(UpdateCollectionImageUrlDocument, options);
}
export type UpdateCollectionImageUrlMutationHookResult = ReturnType<
  typeof useUpdateCollectionImageUrlMutation
>;
export type UpdateCollectionImageUrlMutationResult =
  Apollo.MutationResult<UpdateCollectionImageUrlMutation>;
export type UpdateCollectionImageUrlMutationOptions =
  Apollo.BaseMutationOptions<
    UpdateCollectionImageUrlMutation,
    UpdateCollectionImageUrlMutationVariables
  >;
export const UpdateCollectionPartnerDocument = gql`
  mutation updateCollectionPartner(
    $externalId: String!
    $name: String!
    $url: Url!
    $blurb: Markdown!
    $imageUrl: Url
  ) {
    updateCollectionPartner(
      data: {
        externalId: $externalId
        name: $name
        url: $url
        blurb: $blurb
        imageUrl: $imageUrl
      }
    ) {
      ...CollectionPartnerData
    }
  }
  ${CollectionPartnerDataFragmentDoc}
`;
export type UpdateCollectionPartnerMutationFn = Apollo.MutationFunction<
  UpdateCollectionPartnerMutation,
  UpdateCollectionPartnerMutationVariables
>;

/**
 * __useUpdateCollectionPartnerMutation__
 *
 * To run a mutation, you first call `useUpdateCollectionPartnerMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCollectionPartnerMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCollectionPartnerMutation, { data, loading, error }] = useUpdateCollectionPartnerMutation({
 *   variables: {
 *      externalId: // value for 'externalId'
 *      name: // value for 'name'
 *      url: // value for 'url'
 *      blurb: // value for 'blurb'
 *      imageUrl: // value for 'imageUrl'
 *   },
 * });
 */
export function useUpdateCollectionPartnerMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateCollectionPartnerMutation,
    UpdateCollectionPartnerMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateCollectionPartnerMutation,
    UpdateCollectionPartnerMutationVariables
  >(UpdateCollectionPartnerDocument, options);
}
export type UpdateCollectionPartnerMutationHookResult = ReturnType<
  typeof useUpdateCollectionPartnerMutation
>;
export type UpdateCollectionPartnerMutationResult =
  Apollo.MutationResult<UpdateCollectionPartnerMutation>;
export type UpdateCollectionPartnerMutationOptions = Apollo.BaseMutationOptions<
  UpdateCollectionPartnerMutation,
  UpdateCollectionPartnerMutationVariables
>;
export const UpdateCollectionPartnerAssociationDocument = gql`
  mutation updateCollectionPartnerAssociation(
    $externalId: String!
    $type: CollectionPartnershipType!
    $partnerExternalId: String!
    $name: String
    $url: Url
    $imageUrl: Url
    $blurb: Markdown
  ) {
    updateCollectionPartnerAssociation(
      data: {
        externalId: $externalId
        type: $type
        partnerExternalId: $partnerExternalId
        name: $name
        url: $url
        imageUrl: $imageUrl
        blurb: $blurb
      }
    ) {
      ...CollectionPartnerAssociationData
    }
  }
  ${CollectionPartnerAssociationDataFragmentDoc}
`;
export type UpdateCollectionPartnerAssociationMutationFn =
  Apollo.MutationFunction<
    UpdateCollectionPartnerAssociationMutation,
    UpdateCollectionPartnerAssociationMutationVariables
  >;

/**
 * __useUpdateCollectionPartnerAssociationMutation__
 *
 * To run a mutation, you first call `useUpdateCollectionPartnerAssociationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCollectionPartnerAssociationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCollectionPartnerAssociationMutation, { data, loading, error }] = useUpdateCollectionPartnerAssociationMutation({
 *   variables: {
 *      externalId: // value for 'externalId'
 *      type: // value for 'type'
 *      partnerExternalId: // value for 'partnerExternalId'
 *      name: // value for 'name'
 *      url: // value for 'url'
 *      imageUrl: // value for 'imageUrl'
 *      blurb: // value for 'blurb'
 *   },
 * });
 */
export function useUpdateCollectionPartnerAssociationMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateCollectionPartnerAssociationMutation,
    UpdateCollectionPartnerAssociationMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateCollectionPartnerAssociationMutation,
    UpdateCollectionPartnerAssociationMutationVariables
  >(UpdateCollectionPartnerAssociationDocument, options);
}
export type UpdateCollectionPartnerAssociationMutationHookResult = ReturnType<
  typeof useUpdateCollectionPartnerAssociationMutation
>;
export type UpdateCollectionPartnerAssociationMutationResult =
  Apollo.MutationResult<UpdateCollectionPartnerAssociationMutation>;
export type UpdateCollectionPartnerAssociationMutationOptions =
  Apollo.BaseMutationOptions<
    UpdateCollectionPartnerAssociationMutation,
    UpdateCollectionPartnerAssociationMutationVariables
  >;
export const UpdateCollectionPartnerAssociationImageUrlDocument = gql`
  mutation updateCollectionPartnerAssociationImageUrl(
    $externalId: String!
    $imageUrl: Url!
  ) {
    updateCollectionPartnerAssociationImageUrl(
      data: { externalId: $externalId, imageUrl: $imageUrl }
    ) {
      ...CollectionPartnerAssociationData
    }
  }
  ${CollectionPartnerAssociationDataFragmentDoc}
`;
export type UpdateCollectionPartnerAssociationImageUrlMutationFn =
  Apollo.MutationFunction<
    UpdateCollectionPartnerAssociationImageUrlMutation,
    UpdateCollectionPartnerAssociationImageUrlMutationVariables
  >;

/**
 * __useUpdateCollectionPartnerAssociationImageUrlMutation__
 *
 * To run a mutation, you first call `useUpdateCollectionPartnerAssociationImageUrlMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCollectionPartnerAssociationImageUrlMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCollectionPartnerAssociationImageUrlMutation, { data, loading, error }] = useUpdateCollectionPartnerAssociationImageUrlMutation({
 *   variables: {
 *      externalId: // value for 'externalId'
 *      imageUrl: // value for 'imageUrl'
 *   },
 * });
 */
export function useUpdateCollectionPartnerAssociationImageUrlMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateCollectionPartnerAssociationImageUrlMutation,
    UpdateCollectionPartnerAssociationImageUrlMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateCollectionPartnerAssociationImageUrlMutation,
    UpdateCollectionPartnerAssociationImageUrlMutationVariables
  >(UpdateCollectionPartnerAssociationImageUrlDocument, options);
}
export type UpdateCollectionPartnerAssociationImageUrlMutationHookResult =
  ReturnType<typeof useUpdateCollectionPartnerAssociationImageUrlMutation>;
export type UpdateCollectionPartnerAssociationImageUrlMutationResult =
  Apollo.MutationResult<UpdateCollectionPartnerAssociationImageUrlMutation>;
export type UpdateCollectionPartnerAssociationImageUrlMutationOptions =
  Apollo.BaseMutationOptions<
    UpdateCollectionPartnerAssociationImageUrlMutation,
    UpdateCollectionPartnerAssociationImageUrlMutationVariables
  >;
export const UpdateCollectionPartnerImageUrlDocument = gql`
  mutation updateCollectionPartnerImageUrl(
    $externalId: String!
    $imageUrl: Url!
  ) {
    updateCollectionPartnerImageUrl(
      data: { externalId: $externalId, imageUrl: $imageUrl }
    ) {
      ...CollectionPartnerData
    }
  }
  ${CollectionPartnerDataFragmentDoc}
`;
export type UpdateCollectionPartnerImageUrlMutationFn = Apollo.MutationFunction<
  UpdateCollectionPartnerImageUrlMutation,
  UpdateCollectionPartnerImageUrlMutationVariables
>;

/**
 * __useUpdateCollectionPartnerImageUrlMutation__
 *
 * To run a mutation, you first call `useUpdateCollectionPartnerImageUrlMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCollectionPartnerImageUrlMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCollectionPartnerImageUrlMutation, { data, loading, error }] = useUpdateCollectionPartnerImageUrlMutation({
 *   variables: {
 *      externalId: // value for 'externalId'
 *      imageUrl: // value for 'imageUrl'
 *   },
 * });
 */
export function useUpdateCollectionPartnerImageUrlMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateCollectionPartnerImageUrlMutation,
    UpdateCollectionPartnerImageUrlMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateCollectionPartnerImageUrlMutation,
    UpdateCollectionPartnerImageUrlMutationVariables
  >(UpdateCollectionPartnerImageUrlDocument, options);
}
export type UpdateCollectionPartnerImageUrlMutationHookResult = ReturnType<
  typeof useUpdateCollectionPartnerImageUrlMutation
>;
export type UpdateCollectionPartnerImageUrlMutationResult =
  Apollo.MutationResult<UpdateCollectionPartnerImageUrlMutation>;
export type UpdateCollectionPartnerImageUrlMutationOptions =
  Apollo.BaseMutationOptions<
    UpdateCollectionPartnerImageUrlMutation,
    UpdateCollectionPartnerImageUrlMutationVariables
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
    $fromPartner: Boolean
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
        fromPartner: $fromPartner
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
 *      fromPartner: // value for 'fromPartner'
 *   },
 * });
 */
export function useUpdateCollectionStoryMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateCollectionStoryMutation,
    UpdateCollectionStoryMutationVariables
  >,
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
export type UpdateCollectionStoryMutationResult =
  Apollo.MutationResult<UpdateCollectionStoryMutation>;
export type UpdateCollectionStoryMutationOptions = Apollo.BaseMutationOptions<
  UpdateCollectionStoryMutation,
  UpdateCollectionStoryMutationVariables
>;
export const UpdateCollectionStoryImageUrlDocument = gql`
  mutation updateCollectionStoryImageUrl(
    $externalId: String!
    $imageUrl: Url!
  ) {
    updateCollectionStoryImageUrl(
      data: { externalId: $externalId, imageUrl: $imageUrl }
    ) {
      ...CollectionStoryData
    }
  }
  ${CollectionStoryDataFragmentDoc}
`;
export type UpdateCollectionStoryImageUrlMutationFn = Apollo.MutationFunction<
  UpdateCollectionStoryImageUrlMutation,
  UpdateCollectionStoryImageUrlMutationVariables
>;

/**
 * __useUpdateCollectionStoryImageUrlMutation__
 *
 * To run a mutation, you first call `useUpdateCollectionStoryImageUrlMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCollectionStoryImageUrlMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCollectionStoryImageUrlMutation, { data, loading, error }] = useUpdateCollectionStoryImageUrlMutation({
 *   variables: {
 *      externalId: // value for 'externalId'
 *      imageUrl: // value for 'imageUrl'
 *   },
 * });
 */
export function useUpdateCollectionStoryImageUrlMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateCollectionStoryImageUrlMutation,
    UpdateCollectionStoryImageUrlMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateCollectionStoryImageUrlMutation,
    UpdateCollectionStoryImageUrlMutationVariables
  >(UpdateCollectionStoryImageUrlDocument, options);
}
export type UpdateCollectionStoryImageUrlMutationHookResult = ReturnType<
  typeof useUpdateCollectionStoryImageUrlMutation
>;
export type UpdateCollectionStoryImageUrlMutationResult =
  Apollo.MutationResult<UpdateCollectionStoryImageUrlMutation>;
export type UpdateCollectionStoryImageUrlMutationOptions =
  Apollo.BaseMutationOptions<
    UpdateCollectionStoryImageUrlMutation,
    UpdateCollectionStoryImageUrlMutationVariables
  >;
export const UpdateCollectionStorySortOrderDocument = gql`
  mutation updateCollectionStorySortOrder(
    $externalId: String!
    $sortOrder: Int!
  ) {
    updateCollectionStorySortOrder(
      data: { externalId: $externalId, sortOrder: $sortOrder }
    ) {
      ...CollectionStoryData
    }
  }
  ${CollectionStoryDataFragmentDoc}
`;
export type UpdateCollectionStorySortOrderMutationFn = Apollo.MutationFunction<
  UpdateCollectionStorySortOrderMutation,
  UpdateCollectionStorySortOrderMutationVariables
>;

/**
 * __useUpdateCollectionStorySortOrderMutation__
 *
 * To run a mutation, you first call `useUpdateCollectionStorySortOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateCollectionStorySortOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateCollectionStorySortOrderMutation, { data, loading, error }] = useUpdateCollectionStorySortOrderMutation({
 *   variables: {
 *      externalId: // value for 'externalId'
 *      sortOrder: // value for 'sortOrder'
 *   },
 * });
 */
export function useUpdateCollectionStorySortOrderMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateCollectionStorySortOrderMutation,
    UpdateCollectionStorySortOrderMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateCollectionStorySortOrderMutation,
    UpdateCollectionStorySortOrderMutationVariables
  >(UpdateCollectionStorySortOrderDocument, options);
}
export type UpdateCollectionStorySortOrderMutationHookResult = ReturnType<
  typeof useUpdateCollectionStorySortOrderMutation
>;
export type UpdateCollectionStorySortOrderMutationResult =
  Apollo.MutationResult<UpdateCollectionStorySortOrderMutation>;
export type UpdateCollectionStorySortOrderMutationOptions =
  Apollo.BaseMutationOptions<
    UpdateCollectionStorySortOrderMutation,
    UpdateCollectionStorySortOrderMutationVariables
  >;
export const UpdateLabelDocument = gql`
  mutation updateLabel($data: UpdateLabelInput!) {
    updateLabel(data: $data) {
      externalId
      name
    }
  }
`;
export type UpdateLabelMutationFn = Apollo.MutationFunction<
  UpdateLabelMutation,
  UpdateLabelMutationVariables
>;

/**
 * __useUpdateLabelMutation__
 *
 * To run a mutation, you first call `useUpdateLabelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLabelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLabelMutation, { data, loading, error }] = useUpdateLabelMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateLabelMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateLabelMutation,
    UpdateLabelMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<UpdateLabelMutation, UpdateLabelMutationVariables>(
    UpdateLabelDocument,
    options,
  );
}
export type UpdateLabelMutationHookResult = ReturnType<
  typeof useUpdateLabelMutation
>;
export type UpdateLabelMutationResult =
  Apollo.MutationResult<UpdateLabelMutation>;
export type UpdateLabelMutationOptions = Apollo.BaseMutationOptions<
  UpdateLabelMutation,
  UpdateLabelMutationVariables
>;
export const UpdateProspectAsCuratedDocument = gql`
  mutation updateProspectAsCurated(
    $id: ID!
    $historyFilter: ApprovedCorpusItemScheduledSurfaceHistoryFilters
  ) {
    updateProspectAsCurated(id: $id) {
      ...ProspectDataWithCorpusItems
    }
  }
  ${ProspectDataWithCorpusItemsFragmentDoc}
`;
export type UpdateProspectAsCuratedMutationFn = Apollo.MutationFunction<
  UpdateProspectAsCuratedMutation,
  UpdateProspectAsCuratedMutationVariables
>;

/**
 * __useUpdateProspectAsCuratedMutation__
 *
 * To run a mutation, you first call `useUpdateProspectAsCuratedMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProspectAsCuratedMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProspectAsCuratedMutation, { data, loading, error }] = useUpdateProspectAsCuratedMutation({
 *   variables: {
 *      id: // value for 'id'
 *      historyFilter: // value for 'historyFilter'
 *   },
 * });
 */
export function useUpdateProspectAsCuratedMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UpdateProspectAsCuratedMutation,
    UpdateProspectAsCuratedMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UpdateProspectAsCuratedMutation,
    UpdateProspectAsCuratedMutationVariables
  >(UpdateProspectAsCuratedDocument, options);
}
export type UpdateProspectAsCuratedMutationHookResult = ReturnType<
  typeof useUpdateProspectAsCuratedMutation
>;
export type UpdateProspectAsCuratedMutationResult =
  Apollo.MutationResult<UpdateProspectAsCuratedMutation>;
export type UpdateProspectAsCuratedMutationOptions = Apollo.BaseMutationOptions<
  UpdateProspectAsCuratedMutation,
  UpdateProspectAsCuratedMutationVariables
>;
export const UploadApprovedCorpusItemImageDocument = gql`
  mutation uploadApprovedCorpusItemImage($image: Upload!) {
    uploadApprovedCorpusItemImage(data: $image) {
      url
    }
  }
`;
export type UploadApprovedCorpusItemImageMutationFn = Apollo.MutationFunction<
  UploadApprovedCorpusItemImageMutation,
  UploadApprovedCorpusItemImageMutationVariables
>;

/**
 * __useUploadApprovedCorpusItemImageMutation__
 *
 * To run a mutation, you first call `useUploadApprovedCorpusItemImageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadApprovedCorpusItemImageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadApprovedCorpusItemImageMutation, { data, loading, error }] = useUploadApprovedCorpusItemImageMutation({
 *   variables: {
 *      image: // value for 'image'
 *   },
 * });
 */
export function useUploadApprovedCorpusItemImageMutation(
  baseOptions?: Apollo.MutationHookOptions<
    UploadApprovedCorpusItemImageMutation,
    UploadApprovedCorpusItemImageMutationVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<
    UploadApprovedCorpusItemImageMutation,
    UploadApprovedCorpusItemImageMutationVariables
  >(UploadApprovedCorpusItemImageDocument, options);
}
export type UploadApprovedCorpusItemImageMutationHookResult = ReturnType<
  typeof useUploadApprovedCorpusItemImageMutation
>;
export type UploadApprovedCorpusItemImageMutationResult =
  Apollo.MutationResult<UploadApprovedCorpusItemImageMutation>;
export type UploadApprovedCorpusItemImageMutationOptions =
  Apollo.BaseMutationOptions<
    UploadApprovedCorpusItemImageMutation,
    UploadApprovedCorpusItemImageMutationVariables
  >;
export const ApprovedCorpusItemByExternalIdDocument = gql`
  query approvedCorpusItemByExternalId(
    $externalId: ID!
    $historyFilter: ApprovedCorpusItemScheduledSurfaceHistoryFilters
  ) {
    approvedCorpusItemByExternalId(externalId: $externalId) {
      ...CuratedItemDataWithHistory
    }
  }
  ${CuratedItemDataWithHistoryFragmentDoc}
`;

/**
 * __useApprovedCorpusItemByExternalIdQuery__
 *
 * To run a query within a React component, call `useApprovedCorpusItemByExternalIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useApprovedCorpusItemByExternalIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useApprovedCorpusItemByExternalIdQuery({
 *   variables: {
 *      externalId: // value for 'externalId'
 *      historyFilter: // value for 'historyFilter'
 *   },
 * });
 */
export function useApprovedCorpusItemByExternalIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    ApprovedCorpusItemByExternalIdQuery,
    ApprovedCorpusItemByExternalIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    ApprovedCorpusItemByExternalIdQuery,
    ApprovedCorpusItemByExternalIdQueryVariables
  >(ApprovedCorpusItemByExternalIdDocument, options);
}
export function useApprovedCorpusItemByExternalIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    ApprovedCorpusItemByExternalIdQuery,
    ApprovedCorpusItemByExternalIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    ApprovedCorpusItemByExternalIdQuery,
    ApprovedCorpusItemByExternalIdQueryVariables
  >(ApprovedCorpusItemByExternalIdDocument, options);
}
export type ApprovedCorpusItemByExternalIdQueryHookResult = ReturnType<
  typeof useApprovedCorpusItemByExternalIdQuery
>;
export type ApprovedCorpusItemByExternalIdLazyQueryHookResult = ReturnType<
  typeof useApprovedCorpusItemByExternalIdLazyQuery
>;
export type ApprovedCorpusItemByExternalIdQueryResult = Apollo.QueryResult<
  ApprovedCorpusItemByExternalIdQuery,
  ApprovedCorpusItemByExternalIdQueryVariables
>;
export const GetApprovedItemByUrlDocument = gql`
  query getApprovedItemByUrl($url: String!) {
    getApprovedCorpusItemByUrl(url: $url) {
      ...CuratedItemData
    }
  }
  ${CuratedItemDataFragmentDoc}
`;

/**
 * __useGetApprovedItemByUrlQuery__
 *
 * To run a query within a React component, call `useGetApprovedItemByUrlQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetApprovedItemByUrlQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetApprovedItemByUrlQuery({
 *   variables: {
 *      url: // value for 'url'
 *   },
 * });
 */
export function useGetApprovedItemByUrlQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetApprovedItemByUrlQuery,
    GetApprovedItemByUrlQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetApprovedItemByUrlQuery,
    GetApprovedItemByUrlQueryVariables
  >(GetApprovedItemByUrlDocument, options);
}
export function useGetApprovedItemByUrlLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetApprovedItemByUrlQuery,
    GetApprovedItemByUrlQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetApprovedItemByUrlQuery,
    GetApprovedItemByUrlQueryVariables
  >(GetApprovedItemByUrlDocument, options);
}
export type GetApprovedItemByUrlQueryHookResult = ReturnType<
  typeof useGetApprovedItemByUrlQuery
>;
export type GetApprovedItemByUrlLazyQueryHookResult = ReturnType<
  typeof useGetApprovedItemByUrlLazyQuery
>;
export type GetApprovedItemByUrlQueryResult = Apollo.QueryResult<
  GetApprovedItemByUrlQuery,
  GetApprovedItemByUrlQueryVariables
>;
export const GetApprovedItemsDocument = gql`
  query getApprovedItems(
    $filters: ApprovedCorpusItemFilter
    $pagination: PaginationInput
  ) {
    getApprovedCorpusItems(filters: $filters, pagination: $pagination) {
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
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetApprovedItemsQuery, GetApprovedItemsQueryVariables>(
    GetApprovedItemsDocument,
    options,
  );
}
export function useGetApprovedItemsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetApprovedItemsQuery,
    GetApprovedItemsQueryVariables
  >,
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
export const GetAuthorByIdDocument = gql`
  query getAuthorById($id: String!) {
    getCollectionAuthor(externalId: $id) {
      ...CollectionAuthorData
    }
  }
  ${CollectionAuthorDataFragmentDoc}
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
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetAuthorByIdQuery, GetAuthorByIdQueryVariables>(
    GetAuthorByIdDocument,
    options,
  );
}
export function useGetAuthorByIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetAuthorByIdQuery,
    GetAuthorByIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetAuthorByIdQuery, GetAuthorByIdQueryVariables>(
    GetAuthorByIdDocument,
    options,
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
  query getAuthors($page: Int, $perPage: Int) {
    getCollectionAuthors(page: $page, perPage: $perPage) {
      authors {
        ...CollectionAuthorData
      }
      pagination {
        currentPage
        totalPages
        totalResults
      }
    }
  }
  ${CollectionAuthorDataFragmentDoc}
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
 *      page: // value for 'page'
 *      perPage: // value for 'perPage'
 *   },
 * });
 */
export function useGetAuthorsQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetAuthorsQuery,
    GetAuthorsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetAuthorsQuery, GetAuthorsQueryVariables>(
    GetAuthorsDocument,
    options,
  );
}
export function useGetAuthorsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetAuthorsQuery,
    GetAuthorsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetAuthorsQuery, GetAuthorsQueryVariables>(
    GetAuthorsDocument,
    options,
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
      ...CollectionData
    }
  }
  ${CollectionDataFragmentDoc}
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
  >,
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
  >,
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
export const GetCollectionPartnerDocument = gql`
  query getCollectionPartner($id: String!) {
    getCollectionPartner(externalId: $id) {
      ...CollectionPartnerData
    }
  }
  ${CollectionPartnerDataFragmentDoc}
`;

/**
 * __useGetCollectionPartnerQuery__
 *
 * To run a query within a React component, call `useGetCollectionPartnerQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCollectionPartnerQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCollectionPartnerQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetCollectionPartnerQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetCollectionPartnerQuery,
    GetCollectionPartnerQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetCollectionPartnerQuery,
    GetCollectionPartnerQueryVariables
  >(GetCollectionPartnerDocument, options);
}
export function useGetCollectionPartnerLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetCollectionPartnerQuery,
    GetCollectionPartnerQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetCollectionPartnerQuery,
    GetCollectionPartnerQueryVariables
  >(GetCollectionPartnerDocument, options);
}
export type GetCollectionPartnerQueryHookResult = ReturnType<
  typeof useGetCollectionPartnerQuery
>;
export type GetCollectionPartnerLazyQueryHookResult = ReturnType<
  typeof useGetCollectionPartnerLazyQuery
>;
export type GetCollectionPartnerQueryResult = Apollo.QueryResult<
  GetCollectionPartnerQuery,
  GetCollectionPartnerQueryVariables
>;
export const GetCollectionPartnerAssociationDocument = gql`
  query getCollectionPartnerAssociation($externalId: String!) {
    getCollectionPartnerAssociationForCollection(externalId: $externalId) {
      ...CollectionPartnerAssociationData
    }
  }
  ${CollectionPartnerAssociationDataFragmentDoc}
`;

/**
 * __useGetCollectionPartnerAssociationQuery__
 *
 * To run a query within a React component, call `useGetCollectionPartnerAssociationQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCollectionPartnerAssociationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCollectionPartnerAssociationQuery({
 *   variables: {
 *      externalId: // value for 'externalId'
 *   },
 * });
 */
export function useGetCollectionPartnerAssociationQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetCollectionPartnerAssociationQuery,
    GetCollectionPartnerAssociationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetCollectionPartnerAssociationQuery,
    GetCollectionPartnerAssociationQueryVariables
  >(GetCollectionPartnerAssociationDocument, options);
}
export function useGetCollectionPartnerAssociationLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetCollectionPartnerAssociationQuery,
    GetCollectionPartnerAssociationQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetCollectionPartnerAssociationQuery,
    GetCollectionPartnerAssociationQueryVariables
  >(GetCollectionPartnerAssociationDocument, options);
}
export type GetCollectionPartnerAssociationQueryHookResult = ReturnType<
  typeof useGetCollectionPartnerAssociationQuery
>;
export type GetCollectionPartnerAssociationLazyQueryHookResult = ReturnType<
  typeof useGetCollectionPartnerAssociationLazyQuery
>;
export type GetCollectionPartnerAssociationQueryResult = Apollo.QueryResult<
  GetCollectionPartnerAssociationQuery,
  GetCollectionPartnerAssociationQueryVariables
>;
export const GetCollectionPartnersDocument = gql`
  query getCollectionPartners($page: Int, $perPage: Int) {
    getCollectionPartners(page: $page, perPage: $perPage) {
      partners {
        ...CollectionPartnerData
      }
      pagination {
        currentPage
        totalPages
        totalResults
      }
    }
  }
  ${CollectionPartnerDataFragmentDoc}
`;

/**
 * __useGetCollectionPartnersQuery__
 *
 * To run a query within a React component, call `useGetCollectionPartnersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCollectionPartnersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCollectionPartnersQuery({
 *   variables: {
 *      page: // value for 'page'
 *      perPage: // value for 'perPage'
 *   },
 * });
 */
export function useGetCollectionPartnersQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetCollectionPartnersQuery,
    GetCollectionPartnersQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetCollectionPartnersQuery,
    GetCollectionPartnersQueryVariables
  >(GetCollectionPartnersDocument, options);
}
export function useGetCollectionPartnersLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetCollectionPartnersQuery,
    GetCollectionPartnersQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetCollectionPartnersQuery,
    GetCollectionPartnersQueryVariables
  >(GetCollectionPartnersDocument, options);
}
export type GetCollectionPartnersQueryHookResult = ReturnType<
  typeof useGetCollectionPartnersQuery
>;
export type GetCollectionPartnersLazyQueryHookResult = ReturnType<
  typeof useGetCollectionPartnersLazyQuery
>;
export type GetCollectionPartnersQueryResult = Apollo.QueryResult<
  GetCollectionPartnersQuery,
  GetCollectionPartnersQueryVariables
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
  >,
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
  >,
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
export const GetCollectionsDocument = gql`
  query getCollections(
    $page: Int!
    $perPage: Int!
    $status: CollectionStatus!
  ) {
    searchCollections(
      filters: { status: $status }
      page: $page
      perPage: $perPage
    ) {
      collections {
        ...CollectionData
      }
      pagination {
        currentPage
        totalPages
        totalResults
      }
    }
  }
  ${CollectionDataFragmentDoc}
`;

/**
 * __useGetCollectionsQuery__
 *
 * To run a query within a React component, call `useGetCollectionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCollectionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCollectionsQuery({
 *   variables: {
 *      page: // value for 'page'
 *      perPage: // value for 'perPage'
 *      status: // value for 'status'
 *   },
 * });
 */
export function useGetCollectionsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetCollectionsQuery,
    GetCollectionsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetCollectionsQuery, GetCollectionsQueryVariables>(
    GetCollectionsDocument,
    options,
  );
}
export function useGetCollectionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetCollectionsQuery,
    GetCollectionsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetCollectionsQuery, GetCollectionsQueryVariables>(
    GetCollectionsDocument,
    options,
  );
}
export type GetCollectionsQueryHookResult = ReturnType<
  typeof useGetCollectionsQuery
>;
export type GetCollectionsLazyQueryHookResult = ReturnType<
  typeof useGetCollectionsLazyQuery
>;
export type GetCollectionsQueryResult = Apollo.QueryResult<
  GetCollectionsQuery,
  GetCollectionsQueryVariables
>;
export const GetInitialCollectionFormDataDocument = gql`
  query getInitialCollectionFormData($page: Int, $perPage: Int) {
    getCollectionAuthors(page: $page, perPage: $perPage) {
      authors {
        ...CollectionAuthorData
      }
    }
    labels {
      externalId
      name
    }
    getLanguages
    getCurationCategories {
      externalId
      name
      slug
    }
    getIABCategories {
      externalId
      name
      slug
      children {
        externalId
        name
        slug
      }
    }
  }
  ${CollectionAuthorDataFragmentDoc}
`;

/**
 * __useGetInitialCollectionFormDataQuery__
 *
 * To run a query within a React component, call `useGetInitialCollectionFormDataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetInitialCollectionFormDataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetInitialCollectionFormDataQuery({
 *   variables: {
 *      page: // value for 'page'
 *      perPage: // value for 'perPage'
 *   },
 * });
 */
export function useGetInitialCollectionFormDataQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetInitialCollectionFormDataQuery,
    GetInitialCollectionFormDataQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetInitialCollectionFormDataQuery,
    GetInitialCollectionFormDataQueryVariables
  >(GetInitialCollectionFormDataDocument, options);
}
export function useGetInitialCollectionFormDataLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetInitialCollectionFormDataQuery,
    GetInitialCollectionFormDataQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetInitialCollectionFormDataQuery,
    GetInitialCollectionFormDataQueryVariables
  >(GetInitialCollectionFormDataDocument, options);
}
export type GetInitialCollectionFormDataQueryHookResult = ReturnType<
  typeof useGetInitialCollectionFormDataQuery
>;
export type GetInitialCollectionFormDataLazyQueryHookResult = ReturnType<
  typeof useGetInitialCollectionFormDataLazyQuery
>;
export type GetInitialCollectionFormDataQueryResult = Apollo.QueryResult<
  GetInitialCollectionFormDataQuery,
  GetInitialCollectionFormDataQueryVariables
>;
export const GetOpenGraphFieldsDocument = gql`
  query getOpenGraphFields($url: Url!) {
    getOpenGraphFields(url: $url) {
      description
    }
  }
`;

/**
 * __useGetOpenGraphFieldsQuery__
 *
 * To run a query within a React component, call `useGetOpenGraphFieldsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetOpenGraphFieldsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetOpenGraphFieldsQuery({
 *   variables: {
 *      url: // value for 'url'
 *   },
 * });
 */
export function useGetOpenGraphFieldsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetOpenGraphFieldsQuery,
    GetOpenGraphFieldsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetOpenGraphFieldsQuery,
    GetOpenGraphFieldsQueryVariables
  >(GetOpenGraphFieldsDocument, options);
}
export function useGetOpenGraphFieldsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetOpenGraphFieldsQuery,
    GetOpenGraphFieldsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetOpenGraphFieldsQuery,
    GetOpenGraphFieldsQueryVariables
  >(GetOpenGraphFieldsDocument, options);
}
export type GetOpenGraphFieldsQueryHookResult = ReturnType<
  typeof useGetOpenGraphFieldsQuery
>;
export type GetOpenGraphFieldsLazyQueryHookResult = ReturnType<
  typeof useGetOpenGraphFieldsLazyQuery
>;
export type GetOpenGraphFieldsQueryResult = Apollo.QueryResult<
  GetOpenGraphFieldsQuery,
  GetOpenGraphFieldsQueryVariables
>;
export const GetProspectsDocument = gql`
  query getProspects(
    $scheduledSurfaceGuid: String!
    $prospectType: String
    $historyFilter: ApprovedCorpusItemScheduledSurfaceHistoryFilters
  ) {
    getProspects(
      filters: {
        scheduledSurfaceGuid: $scheduledSurfaceGuid
        prospectType: $prospectType
      }
    ) {
      ...ProspectDataWithCorpusItems
    }
  }
  ${ProspectDataWithCorpusItemsFragmentDoc}
`;

/**
 * __useGetProspectsQuery__
 *
 * To run a query within a React component, call `useGetProspectsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProspectsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProspectsQuery({
 *   variables: {
 *      scheduledSurfaceGuid: // value for 'scheduledSurfaceGuid'
 *      prospectType: // value for 'prospectType'
 *      historyFilter: // value for 'historyFilter'
 *   },
 * });
 */
export function useGetProspectsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetProspectsQuery,
    GetProspectsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetProspectsQuery, GetProspectsQueryVariables>(
    GetProspectsDocument,
    options,
  );
}
export function useGetProspectsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetProspectsQuery,
    GetProspectsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetProspectsQuery, GetProspectsQueryVariables>(
    GetProspectsDocument,
    options,
  );
}
export type GetProspectsQueryHookResult = ReturnType<
  typeof useGetProspectsQuery
>;
export type GetProspectsLazyQueryHookResult = ReturnType<
  typeof useGetProspectsLazyQuery
>;
export type GetProspectsQueryResult = Apollo.QueryResult<
  GetProspectsQuery,
  GetProspectsQueryVariables
>;
export const GetRejectedItemsDocument = gql`
  query getRejectedItems(
    $filters: RejectedCorpusItemFilter
    $pagination: PaginationInput
  ) {
    getRejectedCorpusItems(filters: $filters, pagination: $pagination) {
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
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetRejectedItemsQuery, GetRejectedItemsQueryVariables>(
    GetRejectedItemsDocument,
    options,
  );
}
export function useGetRejectedItemsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetRejectedItemsQuery,
    GetRejectedItemsQueryVariables
  >,
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
export const GetScheduledItemCountsDocument = gql`
  query getScheduledItemCounts($filters: ScheduledCorpusItemsFilterInput!) {
    getScheduledCorpusItems(filters: $filters) {
      collectionCount
      syndicatedCount
      totalCount
    }
  }
`;

/**
 * __useGetScheduledItemCountsQuery__
 *
 * To run a query within a React component, call `useGetScheduledItemCountsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetScheduledItemCountsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetScheduledItemCountsQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *   },
 * });
 */
export function useGetScheduledItemCountsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetScheduledItemCountsQuery,
    GetScheduledItemCountsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetScheduledItemCountsQuery,
    GetScheduledItemCountsQueryVariables
  >(GetScheduledItemCountsDocument, options);
}
export function useGetScheduledItemCountsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetScheduledItemCountsQuery,
    GetScheduledItemCountsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetScheduledItemCountsQuery,
    GetScheduledItemCountsQueryVariables
  >(GetScheduledItemCountsDocument, options);
}
export type GetScheduledItemCountsQueryHookResult = ReturnType<
  typeof useGetScheduledItemCountsQuery
>;
export type GetScheduledItemCountsLazyQueryHookResult = ReturnType<
  typeof useGetScheduledItemCountsLazyQuery
>;
export type GetScheduledItemCountsQueryResult = Apollo.QueryResult<
  GetScheduledItemCountsQuery,
  GetScheduledItemCountsQueryVariables
>;
export const GetScheduledItemsDocument = gql`
  query getScheduledItems($filters: ScheduledCorpusItemsFilterInput!) {
    getScheduledCorpusItems(filters: $filters) {
      collectionCount
      syndicatedCount
      totalCount
      scheduledDate
      items {
        ...ScheduledItemData
      }
    }
  }
  ${ScheduledItemDataFragmentDoc}
`;

/**
 * __useGetScheduledItemsQuery__
 *
 * To run a query within a React component, call `useGetScheduledItemsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetScheduledItemsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetScheduledItemsQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *   },
 * });
 */
export function useGetScheduledItemsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetScheduledItemsQuery,
    GetScheduledItemsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetScheduledItemsQuery,
    GetScheduledItemsQueryVariables
  >(GetScheduledItemsDocument, options);
}
export function useGetScheduledItemsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetScheduledItemsQuery,
    GetScheduledItemsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetScheduledItemsQuery,
    GetScheduledItemsQueryVariables
  >(GetScheduledItemsDocument, options);
}
export type GetScheduledItemsQueryHookResult = ReturnType<
  typeof useGetScheduledItemsQuery
>;
export type GetScheduledItemsLazyQueryHookResult = ReturnType<
  typeof useGetScheduledItemsLazyQuery
>;
export type GetScheduledItemsQueryResult = Apollo.QueryResult<
  GetScheduledItemsQuery,
  GetScheduledItemsQueryVariables
>;
export const GetScheduledSurfacesForUserDocument = gql`
  query getScheduledSurfacesForUser {
    getScheduledSurfacesForUser {
      guid
      name
      prospectTypes
      ianaTimezone
    }
  }
`;

/**
 * __useGetScheduledSurfacesForUserQuery__
 *
 * To run a query within a React component, call `useGetScheduledSurfacesForUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetScheduledSurfacesForUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetScheduledSurfacesForUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetScheduledSurfacesForUserQuery(
  baseOptions?: Apollo.QueryHookOptions<
    GetScheduledSurfacesForUserQuery,
    GetScheduledSurfacesForUserQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetScheduledSurfacesForUserQuery,
    GetScheduledSurfacesForUserQueryVariables
  >(GetScheduledSurfacesForUserDocument, options);
}
export function useGetScheduledSurfacesForUserLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetScheduledSurfacesForUserQuery,
    GetScheduledSurfacesForUserQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetScheduledSurfacesForUserQuery,
    GetScheduledSurfacesForUserQueryVariables
  >(GetScheduledSurfacesForUserDocument, options);
}
export type GetScheduledSurfacesForUserQueryHookResult = ReturnType<
  typeof useGetScheduledSurfacesForUserQuery
>;
export type GetScheduledSurfacesForUserLazyQueryHookResult = ReturnType<
  typeof useGetScheduledSurfacesForUserLazyQuery
>;
export type GetScheduledSurfacesForUserQueryResult = Apollo.QueryResult<
  GetScheduledSurfacesForUserQuery,
  GetScheduledSurfacesForUserQueryVariables
>;
export const SearchCollectionsDocument = gql`
  query searchCollections(
    $filters: SearchCollectionsFilters!
    $page: Int
    $perPage: Int
  ) {
    searchCollections(filters: $filters, page: $page, perPage: $perPage) {
      collections {
        ...CollectionData
      }
      pagination {
        currentPage
        totalPages
        totalResults
        perPage
      }
    }
  }
  ${CollectionDataFragmentDoc}
`;

/**
 * __useSearchCollectionsQuery__
 *
 * To run a query within a React component, call `useSearchCollectionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchCollectionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchCollectionsQuery({
 *   variables: {
 *      filters: // value for 'filters'
 *      page: // value for 'page'
 *      perPage: // value for 'perPage'
 *   },
 * });
 */
export function useSearchCollectionsQuery(
  baseOptions: Apollo.QueryHookOptions<
    SearchCollectionsQuery,
    SearchCollectionsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    SearchCollectionsQuery,
    SearchCollectionsQueryVariables
  >(SearchCollectionsDocument, options);
}
export function useSearchCollectionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    SearchCollectionsQuery,
    SearchCollectionsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    SearchCollectionsQuery,
    SearchCollectionsQueryVariables
  >(SearchCollectionsDocument, options);
}
export type SearchCollectionsQueryHookResult = ReturnType<
  typeof useSearchCollectionsQuery
>;
export type SearchCollectionsLazyQueryHookResult = ReturnType<
  typeof useSearchCollectionsLazyQuery
>;
export type SearchCollectionsQueryResult = Apollo.QueryResult<
  SearchCollectionsQuery,
  SearchCollectionsQueryVariables
>;
export const GetSectionsWithSectionItemsDocument = gql`
  query getSectionsWithSectionItems(
    $scheduledSurfaceGuid: ID!
    $createSource: ActivitySource
  ) {
    getSectionsWithSectionItems(
      scheduledSurfaceGuid: $scheduledSurfaceGuid
      createSource: $createSource
    ) {
      ...SectionData
    }
  }
  ${SectionDataFragmentDoc}
`;

/**
 * __useGetSectionsWithSectionItemsQuery__
 *
 * To run a query within a React component, call `useGetSectionsWithSectionItemsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetSectionsWithSectionItemsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetSectionsWithSectionItemsQuery({
 *   variables: {
 *      scheduledSurfaceGuid: // value for 'scheduledSurfaceGuid'
 *      createSource: // value for 'createSource'
 *   },
 * });
 */
export function useGetSectionsWithSectionItemsQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetSectionsWithSectionItemsQuery,
    GetSectionsWithSectionItemsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetSectionsWithSectionItemsQuery,
    GetSectionsWithSectionItemsQueryVariables
  >(GetSectionsWithSectionItemsDocument, options);
}
export function useGetSectionsWithSectionItemsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetSectionsWithSectionItemsQuery,
    GetSectionsWithSectionItemsQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetSectionsWithSectionItemsQuery,
    GetSectionsWithSectionItemsQueryVariables
  >(GetSectionsWithSectionItemsDocument, options);
}
export type GetSectionsWithSectionItemsQueryHookResult = ReturnType<
  typeof useGetSectionsWithSectionItemsQuery
>;
export type GetSectionsWithSectionItemsLazyQueryHookResult = ReturnType<
  typeof useGetSectionsWithSectionItemsLazyQuery
>;
export type GetSectionsWithSectionItemsQueryResult = Apollo.QueryResult<
  GetSectionsWithSectionItemsQuery,
  GetSectionsWithSectionItemsQueryVariables
>;
export const GetStoryFromParserDocument = gql`
  query getStoryFromParser($url: String!) {
    getItemByUrl(url: $url) {
      resolvedUrl
      title
      excerpt
      topImageUrl
      images {
        src
        width
        height
      }
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
 *      url: // value for 'url'
 *   },
 * });
 */
export function useGetStoryFromParserQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetStoryFromParserQuery,
    GetStoryFromParserQueryVariables
  >,
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
  >,
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
export const GetUrlMetadataDocument = gql`
  query getUrlMetadata($url: String!) {
    getUrlMetadata(url: $url) {
      ...urlMetadata
    }
  }
  ${UrlMetadataFragmentDoc}
`;

/**
 * __useGetUrlMetadataQuery__
 *
 * To run a query within a React component, call `useGetUrlMetadataQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUrlMetadataQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUrlMetadataQuery({
 *   variables: {
 *      url: // value for 'url'
 *   },
 * });
 */
export function useGetUrlMetadataQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetUrlMetadataQuery,
    GetUrlMetadataQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetUrlMetadataQuery, GetUrlMetadataQueryVariables>(
    GetUrlMetadataDocument,
    options,
  );
}
export function useGetUrlMetadataLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetUrlMetadataQuery,
    GetUrlMetadataQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetUrlMetadataQuery, GetUrlMetadataQueryVariables>(
    GetUrlMetadataDocument,
    options,
  );
}
export type GetUrlMetadataQueryHookResult = ReturnType<
  typeof useGetUrlMetadataQuery
>;
export type GetUrlMetadataLazyQueryHookResult = ReturnType<
  typeof useGetUrlMetadataLazyQuery
>;
export type GetUrlMetadataQueryResult = Apollo.QueryResult<
  GetUrlMetadataQuery,
  GetUrlMetadataQueryVariables
>;
export const LabelsDocument = gql`
  query labels {
    labels {
      externalId
      name
    }
  }
`;

/**
 * __useLabelsQuery__
 *
 * To run a query within a React component, call `useLabelsQuery` and pass it any options that fit your needs.
 * When your component renders, `useLabelsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLabelsQuery({
 *   variables: {
 *   },
 * });
 */
export function useLabelsQuery(
  baseOptions?: Apollo.QueryHookOptions<LabelsQuery, LabelsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<LabelsQuery, LabelsQueryVariables>(
    LabelsDocument,
    options,
  );
}
export function useLabelsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<LabelsQuery, LabelsQueryVariables>,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<LabelsQuery, LabelsQueryVariables>(
    LabelsDocument,
    options,
  );
}
export type LabelsQueryHookResult = ReturnType<typeof useLabelsQuery>;
export type LabelsLazyQueryHookResult = ReturnType<typeof useLabelsLazyQuery>;
export type LabelsQueryResult = Apollo.QueryResult<
  LabelsQuery,
  LabelsQueryVariables
>;
export const SearchShareableListDocument = gql`
  query searchShareableList($externalId: ID!) {
    searchShareableList(externalId: $externalId) {
      ...ShareableListCompleteProps
    }
  }
  ${ShareableListCompletePropsFragmentDoc}
`;

/**
 * __useSearchShareableListQuery__
 *
 * To run a query within a React component, call `useSearchShareableListQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchShareableListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchShareableListQuery({
 *   variables: {
 *      externalId: // value for 'externalId'
 *   },
 * });
 */
export function useSearchShareableListQuery(
  baseOptions: Apollo.QueryHookOptions<
    SearchShareableListQuery,
    SearchShareableListQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    SearchShareableListQuery,
    SearchShareableListQueryVariables
  >(SearchShareableListDocument, options);
}
export function useSearchShareableListLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    SearchShareableListQuery,
    SearchShareableListQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    SearchShareableListQuery,
    SearchShareableListQueryVariables
  >(SearchShareableListDocument, options);
}
export type SearchShareableListQueryHookResult = ReturnType<
  typeof useSearchShareableListQuery
>;
export type SearchShareableListLazyQueryHookResult = ReturnType<
  typeof useSearchShareableListLazyQuery
>;
export type SearchShareableListQueryResult = Apollo.QueryResult<
  SearchShareableListQuery,
  SearchShareableListQueryVariables
>;
