import { gql } from '@apollo/client';
import { CollectionAuthorData } from '../fragments/CollectionAuthorData';

/**
 * Get a list of authors
 */
export const getAuthors = gql`
  query getAuthors($page: Int, $perPage: Int) {
    getCollectionAuthors(page: $page, perPage: $perPage) {
      authors {
        ...CollectionAuthorData
      }
    }
  }
  ${CollectionAuthorData}
`;
