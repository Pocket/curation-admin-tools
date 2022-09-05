import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { config } from '../config';
import {
  getCollectionAuthorsFieldPolicy,
  getCollectionPartnersFieldPolicy,
  searchCollectionsFieldPolicy,
} from './field-policies';

/**
 * Custom type policies for Apollo Cache. Now in their own
 * variable to feed them into integration tests, too.
 */
export const apolloCache = new InMemoryCache({
  typePolicies: {
    CollectionAuthor: {
      keyFields: ['externalId'],
    },
    CollectionStory: {
      keyFields: ['externalId'],
    },
    Collection: {
      keyFields: ['externalId'],
    },
    ApprovedCorpusItem: {
      keyFields: ['externalId'],
    },
    RejectedCorpusItem: {
      keyFields: ['externalId'],
    },
    ScheduledCorpusItem: {
      keyFields: ['externalId'],
    },
    ScheduledCorpusItemsResult: {
      keyFields: ['scheduledDate'],
    },
    Query: {
      fields: {
        getCollectionAuthors: getCollectionAuthorsFieldPolicy,
        getCollectionPartners: getCollectionPartnersFieldPolicy,
        searchCollections: searchCollectionsFieldPolicy,
      },
    },
  },
});

const apolloOptions = {
  cache: apolloCache,
  name: config.apolloClientName,
  version: config.version,
};

export const client = new ApolloClient({
  link: createUploadLink({
    uri: config.adminApiEndpoint,
    headers: { 'Apollo-Require-Preflight': true },
  }),
  ...apolloOptions,
});
