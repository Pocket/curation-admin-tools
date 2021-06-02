import { gql } from '@apollo/client';
import { CollectionData } from '../fragments/CollectionData';

/**
 * Get a list of published collections
 */
export const getPublishedCollections = gql`
  query getPublishedCollections($page: Int, $perPage: Int) {
    searchCollections(
      filters: { status: PUBLISHED }
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
