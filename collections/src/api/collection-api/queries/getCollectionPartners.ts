import { gql } from '@apollo/client';
import { CollectionPartnerData } from '../fragments/CollectionPartnerData';

/**
 * Get a list of collection partners
 */
export const getCollectionPartners = gql`
  query getCollectionPartners($page: Int, $perPage: Int) {
    getCollectionPartners(page: $page, perPage: $perPage) {
      partners {
        ...CollectionPartnerData
      }
      pagination {
        currentPage
        totalPages
        totalResults
      }
    }
  }
  ${CollectionPartnerData}
`;
