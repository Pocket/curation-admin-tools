import { gql } from '@apollo/client';
import { AuthorData } from '../fragments/AuthorData';

/**
 * Get a list of authors
 */
export const getAuthors = gql`
  query getAuthors {
    getCollectionAuthors {
      authors {
        ...AuthorData
      }
    }
  }
  ${AuthorData}
`;
