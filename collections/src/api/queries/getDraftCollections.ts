import { gql } from '@apollo/client';

/**
 * Get a list of draft collections
 */
export const getDraftCollections = gql`
  query getDraftCollections {
    searchCollections(filters: { status: DRAFT }) {
      collections {
        externalId
        title
        slug
        excerpt
        intro
        imageUrl
        status
        authors {
          externalId
          name
          slug
          bio
          imageUrl
          active
        }
        stories {
          title
        }
      }
    }
  }
`;
