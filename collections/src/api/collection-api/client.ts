import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from 'apollo-upload-client';
import { config } from '../../config';

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
            keyArgs: false,
            merge(existing, incoming, { args }) {
              if (!args) {
                // TODO: remove the hardcoded perPage value
                //  and place it into a constant somewhere
                args = { page: 1, perPage: 50 };
              }

              const mergedAuthors = existing ? existing.authors.slice(0) : [];

              // Insert the incoming elements in the right places, according to args.
              const offset = (args.page - 1) * args.perPage;
              const end =
                offset + Math.min(args.perPage, incoming.authors.length);

              for (let i = offset; i < end; ++i) {
                mergedAuthors[i] = incoming.authors[i - offset];
              }
              return {
                authors: mergedAuthors,
                pagination: incoming.pagination,
              };
            },
            read(existing, { args }) {
              console.log(args);

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
