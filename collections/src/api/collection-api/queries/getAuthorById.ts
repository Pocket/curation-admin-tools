import { gql } from '@apollo/client';
import { CollectionAuthorData } from '../fragments/CollectionAuthorData';

/**
 * Get author information by their external id.
 */
export const getAuthorById = gql`
  query getAuthorById($id: String!) {
    getCollectionAuthor(externalId: $id) {
      ...CollectionAuthorData
    }
  }
  ${CollectionAuthorData}
`;
