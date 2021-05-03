import { gql } from '@apollo/client';
import { AuthorData } from '../fragments/AuthorData';

/**
 * Get a list of archived collections
 */
export const getArchivedCollections = gql`
  query getArchivedCollections($page: Int, $perPage: Int) {
    searchCollections(
      filters: { status: ARCHIVED }
      page: $page
      perPage: $perPage
    ) {
      collections {
        externalId
        title
        slug
        excerpt
        intro
        imageUrl
        status
        authors {
          ...AuthorData
        }
      }
      pagination {
        totalResults
      }
    }
  }
  ${AuthorData}
`;
