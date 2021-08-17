import { gql } from '@apollo/client';
import { CollectionData } from '../fragments/CollectionData';

/**
 * Get a paginated list of collections with a given status
 */
export const getCollections = gql`
  query getCollections(
    $page: Int!
    $perPage: Int!
    $status: CollectionStatus!
  ) {
    searchCollections(
      filters: { status: $status }
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
