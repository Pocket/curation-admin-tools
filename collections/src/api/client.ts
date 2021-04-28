import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: `${process.env.REACT_APP_COLLECTION_API_ENDPOINT}`,
  cache: new InMemoryCache(),
  name: `CurationAdminToolsCollections`,
  version: `${process.env.REACT_APP_GIT_SHA ?? 'local'}`
});
