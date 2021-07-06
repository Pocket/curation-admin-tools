import { gql } from '@apollo/client';
import { CollectionData } from '../fragments/CollectionData';

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
        ...CollectionData
      }
      pagination {
        currentPage
        totalPages
        totalResults
      }
    }
  }
  ${CollectionData}
`;
