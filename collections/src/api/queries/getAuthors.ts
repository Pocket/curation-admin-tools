import { gql } from '@apollo/client';

/**
 * Get a list of authors
 */
export const getAuthors = gql`
  query getAuthors {
    getCollectionAuthors {
      authors {
        externalId
        name
        slug
        bio
        imageUrl
        active
      }
    }
  }
`;
