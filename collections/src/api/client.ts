import { ApolloClient, InMemoryCache } from '@apollo/client';
import { config } from '../config';
import { createUploadLink } from 'apollo-upload-client';

const apolloOptions = {
  cache: new InMemoryCache({
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
    },
  }),
  name: config.apolloClientName,
  version: config.version,
};

export const client = new ApolloClient({
  link: createUploadLink({
    uri: config.collectionApiEndpoint,
  }),
  ...apolloOptions,
});

export const clientAPIClient = new ApolloClient({
  uri: config.clientApiEndpoint,
  ...apolloOptions,
});
