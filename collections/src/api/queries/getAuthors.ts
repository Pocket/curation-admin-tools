import { gql } from '@apollo/client';
import { AuthorData } from '../fragments/AuthorData';

/**
 * Get a list of authors
 */
export const getAuthors = gql`
  query getAuthors($page: Int, $perPage: Int) {
    getCollectionAuthors(page: $page, perPage: $perPage) {
      authors {
        ...AuthorData
      }
    }
  }
  ${AuthorData}
`;
