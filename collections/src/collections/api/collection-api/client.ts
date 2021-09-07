import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { config } from '../../config';
import {
  getCollectionAuthorsFieldPolicy,
  getCollectionPartnersFieldPolicy,
  searchCollectionsFieldPolicy,
} from './field-policies';

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
      Query: {
        fields: {
          getCollectionAuthors: getCollectionAuthorsFieldPolicy,
          getCollectionPartners: getCollectionPartnersFieldPolicy,
          searchCollections: searchCollectionsFieldPolicy,
        },
      },
    },
  }),
  name: config.apolloClientName,
  version: config.version,
};

export const client = new ApolloClient({
  link: createUploadLink({ uri: config.collectionApiEndpoint }),
  ...apolloOptions,
});
