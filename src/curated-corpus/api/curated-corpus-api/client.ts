import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { config } from '../../../config';

const apolloOptions = {
  cache: new InMemoryCache({}),
  name: config.apolloClientName,
  version: config.version,
};

export const client = new ApolloClient({
  link: createUploadLink({ uri: config.curatedCorpusApiEndpoint }),
  ...apolloOptions,
});