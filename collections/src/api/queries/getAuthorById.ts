import { gql } from '@apollo/client';
import { AuthorData } from '../fragments/AuthorData';

/**
 * Get author information by their external id.
 */
export const getAuthorById = gql`
  query getAuthorById($id: String!) {
    getCollectionAuthor(externalId: $id) {
      ...AuthorData
    }
  }
  ${AuthorData}
`;
