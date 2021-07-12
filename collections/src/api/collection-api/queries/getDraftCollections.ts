import { gql } from '@apollo/client';
import { CollectionData } from '../fragments/CollectionData';

/**
 * Get a list of draft collections
 */
export const getDraftCollections = gql`
  query getDraftCollections($page: Int, $perPage: Int) {
    searchCollections(
      filters: { status: DRAFT }
      page: $page
      perPage: $perPage
    ) {
      collections {
        ...CollectionData
      }
      pagination {
        totalResults
      }
    }
  }
  ${CollectionData}
`;
