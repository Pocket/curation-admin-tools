import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { config } from '../../config';
import { CollectionAuthorsResult } from './generatedTypes';

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
          getCollectionAuthors: {
            // Ignore all query variables when merging CollectionAuthor objects in the cache.
            keyArgs: false,
            // Merge the authors into a single list in the cache.
            merge(existing, incoming, { args }): CollectionAuthorsResult {
              if (!args) {
                return existing;
              } else {
                // We only need to merge the 'authors' part of the result
                const mergedAuthors = existing ? existing.authors.slice(0) : [];

                // Insert the incoming elements in the right places, according to args.
                // For the authors, this keeps the list in alphabetical order even if
                // the user clicks on page numbers randomly.
                const offset = (args.page - 1) * args.perPage;
                const end =
                  offset + Math.min(args.perPage, incoming.authors.length);

                for (let i = offset; i < end; ++i) {
                  mergedAuthors[i] = incoming.authors[i - offset];
                }

                // Return the merged authors list and the updated pagination values
                return {
                  authors: mergedAuthors,
                  pagination: incoming.pagination,
                };
              }
            },
            read(existing) {
              return existing;
            },
          },
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
