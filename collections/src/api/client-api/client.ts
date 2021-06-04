import { ApolloClient, InMemoryCache } from '@apollo/client';
import { config } from '../../config';

const apolloOptions = {
  cache: new InMemoryCache(),
  name: config.apolloClientName,
  version: config.version,
};

export const client = new ApolloClient({
  uri: config.clientApiEndpoint,
  ...apolloOptions,
});
