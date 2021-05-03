import { gql } from '@apollo/client';
import { CollectionAuthors } from '../fragments/CollectionAuthors';

/**
 * Get collection by its external id.
 */
export const getCollectionById = gql`
  query getCollectionById($id: String!) {
    getCollection(externalId: $id) {
      externalId
      title
      slug
      excerpt
      intro
      imageUrl
      status
      ...CollectionAuthors
    }
  }
  ${CollectionAuthors}
`;
