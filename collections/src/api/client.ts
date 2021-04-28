import { ApolloClient, InMemoryCache } from '@apollo/client';

const apolloOptions = {
  cache: new InMemoryCache(),
  name: `CurationAdminToolsCollections`,
  version: `${process.env.REACT_APP_GIT_SHA ?? 'local'}`,
};

export const client = new ApolloClient({
  uri: `${process.env.REACT_APP_COLLECTION_API_ENDPOINT}`,
  ...apolloOptions,
});

export const clientAPIClient = new ApolloClient({
  uri: `${process.env.REACT_APP_CLIENT_API_ENDPOINT}`,
  ...apolloOptions,
});
