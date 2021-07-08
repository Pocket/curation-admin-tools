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
            read(existing, { args }) {
              // Args object always returns 'page: 1' when it should return the actual page
              // requested in follow-up fetchMore() calls
              // https://github.com/apollographql/apollo-client/issues/7496 is the closest
              // to the issue we have, but not quite - the solution there essentially sidesteps
              // the problem.
              console.log('args in getCollectionAuthors.read()', args);

              if (!args) {
                return existing;
              } else {
                const offset = (args.page - 1) * args.perPage;

                // If we read the field before any data has been written to the
                // cache, this function will return undefined, which correctly
                // indicates that the field is missing.
                const pagefulOfAuthors =
                  existing &&
                  existing.authors.slice(offset, offset + args.perPage);

                // If we ask for a page outside the bounds of the existing array,
                // page.length will be 0, and we should return undefined instead of
                // the empty array.
                if (pagefulOfAuthors && pagefulOfAuthors.length > 0) {
                  return {
                    authors: pagefulOfAuthors,
                    pagination: existing.pagination,
                  };
                }
              }
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
