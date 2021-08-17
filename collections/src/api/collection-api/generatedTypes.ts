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

export type Collection = {
  __typename?: 'Collection';
  externalId: Scalars['ID'];
  slug: Scalars['String'];
  title: Scalars['String'];
  excerpt?: Maybe<Scalars['Markdown']>;
  status: CollectionStatus;
  curationCategory?: Maybe<CurationCategory>;
  intro?: Maybe<Scalars['Markdown']>;
  imageUrl?: Maybe<Scalars['Url']>;
  /**
   * note that language is *not* being used as locale - only to specify the
   * language of the collection.
   */
  language: Scalars['String'];
  partnership?: Maybe<CollectionPartnership>;
  publishedAt?: Maybe<Scalars['DateString']>;
  authors: Array<CollectionAuthor>;
  stories: Array<CollectionStory>;
  /**
   * We will never return child categories in this type, so there's no need to
   * specify `IABParentCategory` here. The basic `IABCategory` is sufficient.
   */
  IABParentCategory?: Maybe<IabCategory>;
  IABChildCategory?: Maybe<IabCategory>;
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

/** Details of a partner company sponsored collections are associated with. */
export type CollectionPartner = {
  __typename?: 'CollectionPartner';
  externalId: Scalars['String'];
  name: Scalars['String'];
  url: Scalars['Url'];
  imageUrl: Scalars['Url'];
  blurb: Scalars['Markdown'];
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
  externalId: Scalars['String'];
  type: CollectionPartnershipType;
  partner: CollectionPartner;
  name?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['Url']>;
  imageUrl?: Maybe<Scalars['Url']>;
  blurb?: Maybe<Scalars['Markdown']>;
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
  externalId: Scalars['String'];
  type: CollectionPartnershipType;
  name: Scalars['String'];
  url: Scalars['Url'];
  imageUrl: Scalars['Url'];
  blurb: Scalars['Markdown'];
};

/** Type and enums related to Collections made in partnership with a company. */
export enum CollectionPartnershipType {
  Partnered = 'PARTNERED',
  Sponsored = 'SPONSORED',
}

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
  /** if True, the story is provided by a partner and should be displayed as such */
  fromPartner: Scalars['Boolean'];
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
  language: Scalars['String'];
  status?: Maybe<CollectionStatus>;
  authorExternalId: Scalars['String'];
  curationCategoryExternalId?: Maybe<Scalars['String']>;
  IABParentCategoryExternalId?: Maybe<Scalars['String']>;
  IABChildCategoryExternalId?: Maybe<Scalars['String']>;
};

export type CreateCollectionPartnerAssociationInput = {
  type: CollectionPartnershipType;
  partnerExternalId: Scalars['String'];
  collectionExternalId: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['Url']>;
  imageUrl?: Maybe<Scalars['Url']>;
  blurb?: Maybe<Scalars['Markdown']>;
};

export type CreateCollectionPartnerInput = {
  name: Scalars['String'];
  url: Scalars['Url'];
  imageUrl: Scalars['Url'];
  blurb: Scalars['Markdown'];
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

export type CurationCategory = {
  __typename?: 'CurationCategory';
  externalId: Scalars['ID'];
  name: Scalars['String'];
  slug: Scalars['String'];
};

export type DeleteCollectionPartnerAssociationInput = {
  externalId: Scalars['String'];
};

/** Interactive Advertising Bureau Category - these are used on clients to serve relevant ads */
export type IabCategory = {
  __typename?: 'IABCategory';
  externalId: Scalars['String'];
  name: Scalars['String'];
  slug: Scalars['String'];
};

export type IabParentCategory = {
  __typename?: 'IABParentCategory';
  externalId: Scalars['String'];
  name: Scalars['String'];
  slug: Scalars['String'];
  children: Array<IabCategory>;
};

export type Item = {
  __typename?: 'Item';
  /** key field to identify the Item entity in the Parser service */
  givenUrl: Scalars['Url'];
  /** If the item is a collection allow them to get the collection information */
  collection?: Maybe<Collection>;
};

/** represents a language supported in the system */
export type Language = {
  __typename?: 'Language';
  code: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Creates a CollectionAuthor. */
  createCollectionAuthor: CollectionAuthor;
  /** Updates a CollectionAuthor. */
  updateCollectionAuthor: CollectionAuthor;
  /**
   * Updates only the `imageUrl` property of a CollectionAuthor.
   * Dedicated to uploading images within the UI.
   */
  updateCollectionAuthorImageUrl: CollectionAuthor;
  /** Creates a Collection. */
  createCollection: Collection;
  /** Updates a Collection. */
  updateCollection: Collection;
  /**
   * Updates only the `imageUrl` property of a Collection.
   * Dedicated to uploading images within the UI.
   */
  updateCollectionImageUrl: Collection;
  /** Creates a CollectionStory. */
  createCollectionStory: CollectionStory;
  /** Updates a CollectionStory. */
  updateCollectionStory: CollectionStory;
  /**
   * Updates only the `sortOrder` property of a CollectionStory.
   * Dedicated to ordering stories within the UI.
   */
  updateCollectionStorySortOrder: CollectionStory;
  /**
   * Updates only the `imageUrl` property of a CollectionStory.
   * Dedicated to uploading images within the UI.
   */
  updateCollectionStoryImageUrl: CollectionStory;
  /** Deletes a CollectionStory. Also deletes all the related CollectionStoryAuthor records. */
  deleteCollectionStory: CollectionStory;
  /**
   * Uploads an image to S3. Does *not* save the image to any entity
   * (CollectionAuthor/Collection/CollectionStory).
   */
  collectionImageUpload: CollectionImageUrl;
  /** Creates a CollectionPartner. */
  createCollectionPartner: CollectionPartner;
  /** Updates a CollectionPartner. */
  updateCollectionPartner: CollectionPartner;
  /**
   * Updates only the `imageUrl` property of a CollectionPartner.
   * Dedicated to uploading images within the UI.
   */
  updateCollectionPartnerImageUrl: CollectionPartner;
  /** Creates a CollectionPartnerAssociation. */
  createCollectionPartnerAssociation: CollectionPartnerAssociation;
  /** Updates a CollectionPartnerAssociation. */
  updateCollectionPartnerAssociation: CollectionPartnerAssociation;
  /**
   * Updates only the `imageUrl` property of a CollectionPartner.
   * Dedicated to uploading images within the UI.
   */
  updateCollectionPartnerAssociationImageUrl: CollectionPartnerAssociation;
  /** Deletes a CollectionPartnerAssociation. */
  deleteCollectionPartnerAssociation: CollectionPartnerAssociation;
};

export type MutationCreateCollectionAuthorArgs = {
  data: CreateCollectionAuthorInput;
};

export type MutationUpdateCollectionAuthorArgs = {
  data: UpdateCollectionAuthorInput;
};

export type MutationUpdateCollectionAuthorImageUrlArgs = {
  data: UpdateCollectionAuthorImageUrlInput;
};

export type MutationCreateCollectionArgs = {
  data: CreateCollectionInput;
};

export type MutationUpdateCollectionArgs = {
  data: UpdateCollectionInput;
};

export type MutationUpdateCollectionImageUrlArgs = {
  data: UpdateCollectionImageUrlInput;
};

export type MutationCreateCollectionStoryArgs = {
  data: CreateCollectionStoryInput;
};

export type MutationUpdateCollectionStoryArgs = {
  data: UpdateCollectionStoryInput;
};

export type MutationUpdateCollectionStorySortOrderArgs = {
  data: UpdateCollectionStorySortOrderInput;
};

export type MutationUpdateCollectionStoryImageUrlArgs = {
  data: UpdateCollectionStoryImageUrlInput;
};

export type MutationDeleteCollectionStoryArgs = {
  externalId: Scalars['String'];
};

export type MutationCollectionImageUploadArgs = {
  data: CollectionImageUploadInput;
};

export type MutationCreateCollectionPartnerArgs = {
  data: CreateCollectionPartnerInput;
};

export type MutationUpdateCollectionPartnerArgs = {
  data: UpdateCollectionPartnerInput;
};

export type MutationUpdateCollectionPartnerImageUrlArgs = {
  data: UpdateCollectionPartnerImageUrlInput;
};

export type MutationCreateCollectionPartnerAssociationArgs = {
  data: CreateCollectionPartnerAssociationInput;
};

export type MutationUpdateCollectionPartnerAssociationArgs = {
  data: UpdateCollectionPartnerAssociationInput;
};

export type MutationUpdateCollectionPartnerAssociationImageUrlArgs = {
  data: UpdateCollectionPartnerAssociationImageUrlInput;
};

export type MutationDeleteCollectionPartnerAssociationArgs = {
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
  searchCollections: CollectionsResult;
  /** Retrieves a Collection by externalId. */
  getCollection?: Maybe<Collection>;
  /** Retrieves a CollectionAuthor by externalId. */
  getCollectionAuthor?: Maybe<CollectionAuthor>;
  /** Retrieves a paged list of CollectionAuthors. */
  getCollectionAuthors: CollectionAuthorsResult;
  /** Retrieves a CollectionAuthor by externalId. */
  getCollectionPartner?: Maybe<CollectionPartner>;
  /** Retrieves a paged list of CollectionAuthors. */
  getCollectionPartners: CollectionPartnersResult;
  /** Retrieves a CollectionStory by a combination of collectionId and url. */
  getCollectionStory?: Maybe<CollectionStory>;
  /** Retrieves a list of CurationCategories, sorted alphabetically */
  getCurationCategories: Array<CurationCategory>;
  /** Retrieves the nested list of IAB top/sub categories. */
  getIABCategories: Array<IabParentCategory>;
  /** Retrieves the languages currently supported. */
  getLanguages: Array<Language>;
  /** Retrieves a CollectionPartnerAssociation by externalId */
  getCollectionPartnerAssociation?: Maybe<CollectionPartnerAssociation>;
  /**
   * Retrieves a CollectionPartnerAssociation by the externalId of the collection
   * it is related to.
   */
  getCollectionPartnerAssociationForCollection?: Maybe<CollectionPartnerAssociation>;
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

export type QueryGetCollectionPartnerArgs = {
  externalId: Scalars['String'];
};

export type QueryGetCollectionPartnersArgs = {
  page?: Maybe<Scalars['Int']>;
  perPage?: Maybe<Scalars['Int']>;
};

export type QueryGetCollectionStoryArgs = {
  externalId: Scalars['String'];
};

export type QueryGetCollectionPartnerAssociationArgs = {
  externalId: Scalars['String'];
};

export type QueryGetCollectionPartnerAssociationForCollectionArgs = {
  externalId: Scalars['String'];
};

/** available filters for searching collections */
export type SearchCollectionsFilters = {
  author?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  status?: Maybe<CollectionStatus>;
};

export type UpdateCollectionAuthorImageUrlInput = {
  externalId: Scalars['String'];
  imageUrl: Scalars['Url'];
};

export type UpdateCollectionAuthorInput = {
  externalId: Scalars['String'];
  name: Scalars['String'];
  slug: Scalars['String'];
  bio?: Maybe<Scalars['Markdown']>;
  imageUrl?: Maybe<Scalars['Url']>;
  active?: Maybe<Scalars['Boolean']>;
};

export type UpdateCollectionImageUrlInput = {
  externalId: Scalars['String'];
  imageUrl: Scalars['Url'];
};

export type UpdateCollectionInput = {
  externalId?: Maybe<Scalars['String']>;
  slug: Scalars['String'];
  title: Scalars['String'];
  excerpt: Scalars['Markdown'];
  intro?: Maybe<Scalars['Markdown']>;
  imageUrl?: Maybe<Scalars['Url']>;
  language: Scalars['String'];
  status: CollectionStatus;
  authorExternalId: Scalars['String'];
  curationCategoryExternalId?: Maybe<Scalars['String']>;
  IABParentCategoryExternalId?: Maybe<Scalars['String']>;
  IABChildCategoryExternalId?: Maybe<Scalars['String']>;
};

export type UpdateCollectionPartnerAssociationImageUrlInput = {
  externalId: Scalars['String'];
  imageUrl: Scalars['Url'];
};

export type UpdateCollectionPartnerAssociationInput = {
  externalId: Scalars['String'];
  type: CollectionPartnershipType;
  partnerExternalId: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['Url']>;
  imageUrl?: Maybe<Scalars['Url']>;
  blurb?: Maybe<Scalars['Markdown']>;
};

export type UpdateCollectionPartnerImageUrlInput = {
  externalId: Scalars['String'];
  imageUrl: Scalars['Url'];
};

export type UpdateCollectionPartnerInput = {
  externalId: Scalars['String'];
  name: Scalars['String'];
  url: Scalars['Url'];
  imageUrl?: Maybe<Scalars['Url']>;
  blurb: Scalars['Markdown'];
};

export type UpdateCollectionStoryImageUrlInput = {
  externalId: Scalars['String'];
  imageUrl: Scalars['Url'];
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

export type UpdateCollectionStorySortOrderInput = {
  externalId: Scalars['String'];
  sortOrder: Scalars['Int'];
};

export type _Entity = CollectionStory | Item;

export type _Service = {
  __typename?: '_Service';
  /** The sdl representing the federated service capabilities. Includes federation directives, removes federation types, and includes rest of full schema after schema directives have been applied */
  sdl?: Maybe<Scalars['String']>;
};

export type CollectionAuthorDataFragment = {
  __typename?: 'CollectionAuthor';
  externalId: string;
  name: string;
  slug?: Maybe<string>;
  bio?: Maybe<any>;
  imageUrl?: Maybe<any>;
  active: boolean;
};

export type CollectionDataFragment = {
  __typename?: 'Collection';
  externalId: string;
  title: string;
  slug: string;
  excerpt?: Maybe<any>;
  intro?: Maybe<any>;
  imageUrl?: Maybe<any>;
  language: string;
  status: CollectionStatus;
  authors: Array<{
    __typename?: 'CollectionAuthor';
    externalId: string;
    name: string;
    slug?: Maybe<string>;
    bio?: Maybe<any>;
    imageUrl?: Maybe<any>;
    active: boolean;
  }>;
  curationCategory?: Maybe<{
    __typename?: 'CurationCategory';
    externalId: string;
    name: string;
    slug: string;
  }>;
  IABParentCategory?: Maybe<{
    __typename?: 'IABCategory';
    externalId: string;
    name: string;
    slug: string;
  }>;
  IABChildCategory?: Maybe<{
    __typename?: 'IABCategory';
    externalId: string;
    name: string;
    slug: string;
  }>;
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
  imageUrl?: Maybe<any>;
  publisher?: Maybe<string>;
  fromPartner: boolean;
  sortOrder?: Maybe<number>;
  authors: Array<{
    __typename?: 'CollectionStoryAuthor';
    name: string;
    sortOrder: number;
  }>;
};

export type CreateCollectionMutationVariables = Exact<{
  title: Scalars['String'];
  slug: Scalars['String'];
  excerpt?: Maybe<Scalars['Markdown']>;
  intro?: Maybe<Scalars['Markdown']>;
  status: CollectionStatus;
  authorExternalId: Scalars['String'];
  curationCategoryExternalId?: Maybe<Scalars['String']>;
  IABParentCategoryExternalId?: Maybe<Scalars['String']>;
  IABChildCategoryExternalId?: Maybe<Scalars['String']>;
  language: Scalars['String'];
}>;

export type CreateCollectionMutation = {
  __typename?: 'Mutation';
  createCollection: {
    __typename?: 'Collection';
    externalId: string;
    title: string;
    slug: string;
    excerpt?: Maybe<any>;
    intro?: Maybe<any>;
    imageUrl?: Maybe<any>;
    language: string;
    status: CollectionStatus;
    authors: Array<{
      __typename?: 'CollectionAuthor';
      externalId: string;
      name: string;
      slug?: Maybe<string>;
      bio?: Maybe<any>;
      imageUrl?: Maybe<any>;
      active: boolean;
    }>;
    curationCategory?: Maybe<{
      __typename?: 'CurationCategory';
      externalId: string;
      name: string;
      slug: string;
    }>;
    IABParentCategory?: Maybe<{
      __typename?: 'IABCategory';
      externalId: string;
      name: string;
      slug: string;
    }>;
    IABChildCategory?: Maybe<{
      __typename?: 'IABCategory';
      externalId: string;
      name: string;
      slug: string;
    }>;
  };
};

export type CreateCollectionAuthorMutationVariables = Exact<{
  name: Scalars['String'];
  slug?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['Markdown']>;
  imageUrl?: Maybe<Scalars['Url']>;
  active?: Maybe<Scalars['Boolean']>;
}>;

export type CreateCollectionAuthorMutation = {
  __typename?: 'Mutation';
  createCollectionAuthor: {
    __typename?: 'CollectionAuthor';
    externalId: string;
    name: string;
    slug?: Maybe<string>;
    bio?: Maybe<any>;
    imageUrl?: Maybe<any>;
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

export type CreateCollectionStoryMutation = {
  __typename?: 'Mutation';
  createCollectionStory: {
    __typename?: 'CollectionStory';
    externalId: string;
    url: any;
    title: string;
    excerpt: any;
    imageUrl?: Maybe<any>;
    publisher?: Maybe<string>;
    fromPartner: boolean;
    sortOrder?: Maybe<number>;
    authors: Array<{
      __typename?: 'CollectionStoryAuthor';
      name: string;
      sortOrder: number;
    }>;
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
    imageUrl?: Maybe<any>;
    publisher?: Maybe<string>;
    fromPartner: boolean;
    sortOrder?: Maybe<number>;
    authors: Array<{
      __typename?: 'CollectionStoryAuthor';
      name: string;
      sortOrder: number;
    }>;
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

export type UpdateCollectionMutationVariables = Exact<{
  externalId?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  slug: Scalars['String'];
  excerpt: Scalars['Markdown'];
  intro?: Maybe<Scalars['Markdown']>;
  status: CollectionStatus;
  authorExternalId: Scalars['String'];
  curationCategoryExternalId?: Maybe<Scalars['String']>;
  IABParentCategoryExternalId?: Maybe<Scalars['String']>;
  IABChildCategoryExternalId?: Maybe<Scalars['String']>;
  language: Scalars['String'];
  imageUrl?: Maybe<Scalars['Url']>;
}>;

export type UpdateCollectionMutation = {
  __typename?: 'Mutation';
  updateCollection: {
    __typename?: 'Collection';
    externalId: string;
    title: string;
    slug: string;
    excerpt?: Maybe<any>;
    intro?: Maybe<any>;
    imageUrl?: Maybe<any>;
    language: string;
    status: CollectionStatus;
    authors: Array<{
      __typename?: 'CollectionAuthor';
      externalId: string;
      name: string;
      slug?: Maybe<string>;
      bio?: Maybe<any>;
      imageUrl?: Maybe<any>;
      active: boolean;
    }>;
    curationCategory?: Maybe<{
      __typename?: 'CurationCategory';
      externalId: string;
      name: string;
      slug: string;
    }>;
    IABParentCategory?: Maybe<{
      __typename?: 'IABCategory';
      externalId: string;
      name: string;
      slug: string;
    }>;
    IABChildCategory?: Maybe<{
      __typename?: 'IABCategory';
      externalId: string;
      name: string;
      slug: string;
    }>;
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

export type UpdateCollectionAuthorMutation = {
  __typename?: 'Mutation';
  updateCollectionAuthor: {
    __typename?: 'CollectionAuthor';
    externalId: string;
    name: string;
    slug?: Maybe<string>;
    bio?: Maybe<any>;
    imageUrl?: Maybe<any>;
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
    slug?: Maybe<string>;
    bio?: Maybe<any>;
    imageUrl?: Maybe<any>;
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
    excerpt?: Maybe<any>;
    intro?: Maybe<any>;
    imageUrl?: Maybe<any>;
    language: string;
    status: CollectionStatus;
    authors: Array<{
      __typename?: 'CollectionAuthor';
      externalId: string;
      name: string;
      slug?: Maybe<string>;
      bio?: Maybe<any>;
      imageUrl?: Maybe<any>;
      active: boolean;
    }>;
    curationCategory?: Maybe<{
      __typename?: 'CurationCategory';
      externalId: string;
      name: string;
      slug: string;
    }>;
    IABParentCategory?: Maybe<{
      __typename?: 'IABCategory';
      externalId: string;
      name: string;
      slug: string;
    }>;
    IABChildCategory?: Maybe<{
      __typename?: 'IABCategory';
      externalId: string;
      name: string;
      slug: string;
    }>;
  };
};

export type UpdateCollectionPartnerMutationVariables = Exact<{
  externalId: Scalars['String'];
  name: Scalars['String'];
  url: Scalars['Url'];
  blurb: Scalars['Markdown'];
  imageUrl?: Maybe<Scalars['Url']>;
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
  sortOrder?: Maybe<Scalars['Int']>;
}>;

export type UpdateCollectionStoryMutation = {
  __typename?: 'Mutation';
  updateCollectionStory: {
    __typename?: 'CollectionStory';
    externalId: string;
    url: any;
    title: string;
    excerpt: any;
    imageUrl?: Maybe<any>;
    publisher?: Maybe<string>;
    fromPartner: boolean;
    sortOrder?: Maybe<number>;
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
    imageUrl?: Maybe<any>;
    publisher?: Maybe<string>;
    fromPartner: boolean;
    sortOrder?: Maybe<number>;
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
    imageUrl?: Maybe<any>;
    publisher?: Maybe<string>;
    fromPartner: boolean;
    sortOrder?: Maybe<number>;
    authors: Array<{
      __typename?: 'CollectionStoryAuthor';
      name: string;
      sortOrder: number;
    }>;
  };
};

export type GetAuthorByIdQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type GetAuthorByIdQuery = {
  __typename?: 'Query';
  getCollectionAuthor?: Maybe<{
    __typename?: 'CollectionAuthor';
    externalId: string;
    name: string;
    slug?: Maybe<string>;
    bio?: Maybe<any>;
    imageUrl?: Maybe<any>;
    active: boolean;
  }>;
};

export type GetAuthorsQueryVariables = Exact<{
  page?: Maybe<Scalars['Int']>;
  perPage?: Maybe<Scalars['Int']>;
}>;

export type GetAuthorsQuery = {
  __typename?: 'Query';
  getCollectionAuthors: {
    __typename?: 'CollectionAuthorsResult';
    authors: Array<{
      __typename?: 'CollectionAuthor';
      externalId: string;
      name: string;
      slug?: Maybe<string>;
      bio?: Maybe<any>;
      imageUrl?: Maybe<any>;
      active: boolean;
    }>;
    pagination?: Maybe<{
      __typename?: 'Pagination';
      currentPage: number;
      totalPages: number;
      totalResults: number;
    }>;
  };
};

export type GetCollectionByExternalIdQueryVariables = Exact<{
  externalId: Scalars['String'];
}>;

export type GetCollectionByExternalIdQuery = {
  __typename?: 'Query';
  getCollection?: Maybe<{
    __typename?: 'Collection';
    externalId: string;
    title: string;
    slug: string;
    excerpt?: Maybe<any>;
    intro?: Maybe<any>;
    imageUrl?: Maybe<any>;
    language: string;
    status: CollectionStatus;
    authors: Array<{
      __typename?: 'CollectionAuthor';
      externalId: string;
      name: string;
      slug?: Maybe<string>;
      bio?: Maybe<any>;
      imageUrl?: Maybe<any>;
      active: boolean;
    }>;
    curationCategory?: Maybe<{
      __typename?: 'CurationCategory';
      externalId: string;
      name: string;
      slug: string;
    }>;
    IABParentCategory?: Maybe<{
      __typename?: 'IABCategory';
      externalId: string;
      name: string;
      slug: string;
    }>;
    IABChildCategory?: Maybe<{
      __typename?: 'IABCategory';
      externalId: string;
      name: string;
      slug: string;
    }>;
  }>;
};

export type GetCollectionPartnerQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type GetCollectionPartnerQuery = {
  __typename?: 'Query';
  getCollectionPartner?: Maybe<{
    __typename?: 'CollectionPartner';
    externalId: string;
    name: string;
    url: any;
    imageUrl: any;
    blurb: any;
  }>;
};

export type GetCollectionPartnersQueryVariables = Exact<{
  page?: Maybe<Scalars['Int']>;
  perPage?: Maybe<Scalars['Int']>;
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
    pagination?: Maybe<{
      __typename?: 'Pagination';
      currentPage: number;
      totalPages: number;
      totalResults: number;
    }>;
  };
};

export type GetCollectionStoriesQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type GetCollectionStoriesQuery = {
  __typename?: 'Query';
  getCollection?: Maybe<{
    __typename?: 'Collection';
    externalId: string;
    stories: Array<{
      __typename?: 'CollectionStory';
      externalId: string;
      url: any;
      title: string;
      excerpt: any;
      imageUrl?: Maybe<any>;
      publisher?: Maybe<string>;
      fromPartner: boolean;
      sortOrder?: Maybe<number>;
      authors: Array<{
        __typename?: 'CollectionStoryAuthor';
        name: string;
        sortOrder: number;
      }>;
    }>;
  }>;
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
      excerpt?: Maybe<any>;
      intro?: Maybe<any>;
      imageUrl?: Maybe<any>;
      language: string;
      status: CollectionStatus;
      authors: Array<{
        __typename?: 'CollectionAuthor';
        externalId: string;
        name: string;
        slug?: Maybe<string>;
        bio?: Maybe<any>;
        imageUrl?: Maybe<any>;
        active: boolean;
      }>;
      curationCategory?: Maybe<{
        __typename?: 'CurationCategory';
        externalId: string;
        name: string;
        slug: string;
      }>;
      IABParentCategory?: Maybe<{
        __typename?: 'IABCategory';
        externalId: string;
        name: string;
        slug: string;
      }>;
      IABChildCategory?: Maybe<{
        __typename?: 'IABCategory';
        externalId: string;
        name: string;
        slug: string;
      }>;
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
  page?: Maybe<Scalars['Int']>;
  perPage?: Maybe<Scalars['Int']>;
}>;

export type GetInitialCollectionFormDataQuery = {
  __typename?: 'Query';
  getCollectionAuthors: {
    __typename?: 'CollectionAuthorsResult';
    authors: Array<{
      __typename?: 'CollectionAuthor';
      externalId: string;
      name: string;
      slug?: Maybe<string>;
      bio?: Maybe<any>;
      imageUrl?: Maybe<any>;
      active: boolean;
    }>;
  };
  getLanguages: Array<{ __typename?: 'Language'; code: string }>;
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

export type GetSearchCollectionsQueryVariables = Exact<{
  page?: Maybe<Scalars['Int']>;
  perPage?: Maybe<Scalars['Int']>;
  status?: Maybe<CollectionStatus>;
  author?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
}>;

export type GetSearchCollectionsQuery = {
  __typename?: 'Query';
  searchCollections: {
    __typename?: 'CollectionsResult';
    collections: Array<{
      __typename?: 'Collection';
      externalId: string;
      title: string;
      slug: string;
      excerpt?: Maybe<any>;
      intro?: Maybe<any>;
      imageUrl?: Maybe<any>;
      language: string;
      status: CollectionStatus;
      authors: Array<{
        __typename?: 'CollectionAuthor';
        externalId: string;
        name: string;
        slug?: Maybe<string>;
        bio?: Maybe<any>;
        imageUrl?: Maybe<any>;
        active: boolean;
      }>;
      curationCategory?: Maybe<{
        __typename?: 'CurationCategory';
        externalId: string;
        name: string;
        slug: string;
      }>;
      IABParentCategory?: Maybe<{
        __typename?: 'IABCategory';
        externalId: string;
        name: string;
        slug: string;
      }>;
      IABChildCategory?: Maybe<{
        __typename?: 'IABCategory';
        externalId: string;
        name: string;
        slug: string;
      }>;
    }>;
    pagination: { __typename?: 'Pagination'; totalResults: number };
  };
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
export const CreateCollectionDocument = gql`
  mutation createCollection(
    $title: String!
    $slug: String!
    $excerpt: Markdown
    $intro: Markdown
    $status: CollectionStatus!
    $authorExternalId: String!
    $curationCategoryExternalId: String
    $IABParentCategoryExternalId: String
    $IABChildCategoryExternalId: String
    $language: String!
  ) {
    createCollection(
      data: {
        title: $title
        slug: $slug
        excerpt: $excerpt
        intro: $intro
        status: $status
        authorExternalId: $authorExternalId
        curationCategoryExternalId: $curationCategoryExternalId
        IABParentCategoryExternalId: $IABParentCategoryExternalId
        IABChildCategoryExternalId: $IABChildCategoryExternalId
        language: $language
      }
    ) {
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
 *      title: // value for 'title'
 *      slug: // value for 'slug'
 *      excerpt: // value for 'excerpt'
 *      intro: // value for 'intro'
 *      status: // value for 'status'
 *      authorExternalId: // value for 'authorExternalId'
 *      curationCategoryExternalId: // value for 'curationCategoryExternalId'
 *      IABParentCategoryExternalId: // value for 'IABParentCategoryExternalId'
 *      IABChildCategoryExternalId: // value for 'IABChildCategoryExternalId'
 *      language: // value for 'language'
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
  >
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
export type CreateCollectionStoryMutationResult =
  Apollo.MutationResult<CreateCollectionStoryMutation>;
export type CreateCollectionStoryMutationOptions = Apollo.BaseMutationOptions<
  CreateCollectionStoryMutation,
  CreateCollectionStoryMutationVariables
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
export type DeleteCollectionStoryMutationResult =
  Apollo.MutationResult<DeleteCollectionStoryMutation>;
export type DeleteCollectionStoryMutationOptions = Apollo.BaseMutationOptions<
  DeleteCollectionStoryMutation,
  DeleteCollectionStoryMutationVariables
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
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useMutation<ImageUploadMutation, ImageUploadMutationVariables>(
    ImageUploadDocument,
    options
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
export const UpdateCollectionDocument = gql`
  mutation updateCollection(
    $externalId: String
    $title: String!
    $slug: String!
    $excerpt: Markdown!
    $intro: Markdown
    $status: CollectionStatus!
    $authorExternalId: String!
    $curationCategoryExternalId: String
    $IABParentCategoryExternalId: String
    $IABChildCategoryExternalId: String
    $language: String!
    $imageUrl: Url
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
        curationCategoryExternalId: $curationCategoryExternalId
        IABParentCategoryExternalId: $IABParentCategoryExternalId
        IABChildCategoryExternalId: $IABChildCategoryExternalId
        language: $language
        imageUrl: $imageUrl
      }
    ) {
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
 *      externalId: // value for 'externalId'
 *      title: // value for 'title'
 *      slug: // value for 'slug'
 *      excerpt: // value for 'excerpt'
 *      intro: // value for 'intro'
 *      status: // value for 'status'
 *      authorExternalId: // value for 'authorExternalId'
 *      curationCategoryExternalId: // value for 'curationCategoryExternalId'
 *      IABParentCategoryExternalId: // value for 'IABParentCategoryExternalId'
 *      IABChildCategoryExternalId: // value for 'IABChildCategoryExternalId'
 *      language: // value for 'language'
 *      imageUrl: // value for 'imageUrl'
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
  >
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
  >
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
  >
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
  >
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
  >
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
  >
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
  >
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
  >
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
  >
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
  >
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
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetCollectionsQuery, GetCollectionsQueryVariables>(
    GetCollectionsDocument,
    options
  );
}
export function useGetCollectionsLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetCollectionsQuery,
    GetCollectionsQueryVariables
  >
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<GetCollectionsQuery, GetCollectionsQueryVariables>(
    GetCollectionsDocument,
    options
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
    getLanguages {
      code
    }
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
  >
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
  >
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
        ...CollectionData
      }
      pagination {
        totalResults
      }
    }
  }
  ${CollectionDataFragmentDoc}
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
