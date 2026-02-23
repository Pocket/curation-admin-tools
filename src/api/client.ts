import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { config } from '../config';

/**
 * Custom type policies for Apollo Cache. Now in their own
 * variable to feed them into integration tests, too.
 */
export const apolloCache = new InMemoryCache({
  typePolicies: {
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
    headers: { 'Apollo-Require-Preflight': 'true' },
  }) as unknown as ApolloLink,
  ...apolloOptions,
});
