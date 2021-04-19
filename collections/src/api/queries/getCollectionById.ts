import { gql } from '@apollo/client';

/**
 * Get collection by its external id.
 */
export const getCollectionById = gql`
  query getCollectionById($id: String!) {
    allCollections(filter: { externalId: $id }) {
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
