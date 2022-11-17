import { gql } from '@apollo/client';
import { CollectionData } from '../fragments/CollectionData';

/**
 * Seach collections
 */
export const getSearchCollections = gql`
  query searchCollections(
    $filters: SearchCollectionsFilters!
    $page: Int
    $perPage: Int
  ) {
    searchCollections(filters: $filters, page: $page, perPage: $perPage) {
      collections {
        ...CollectionData
      }
      pagination {
        currentPage
        totalPages
        totalResults
        perPage
      }
    }
  }
  ${CollectionData}
`;
