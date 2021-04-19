import { gql } from '@apollo/client';

/**
 * Get a list of collections
 */
export const getCollections = gql`
  query getCollections {
    allCollections(sortField: "updatedAt", sortOrder: "DESC") {
      externalId
      title
      slug
      excerpt
      intro
      imageUrl
      status
    }
  }
`;
