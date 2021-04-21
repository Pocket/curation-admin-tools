import { gql } from '@apollo/client';

/**
 * Get a list of draft collections
 */
export const getDraftCollections = gql`
  query getDraftCollections {
    searchCollections(filters: { status: draft }) {
      collections {
        externalId
        title
        slug
        excerpt
        intro
        imageUrl
        status
      }
    }
  }
`;
