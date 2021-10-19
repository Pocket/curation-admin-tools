import { gql } from '@apollo/client';
import { CuratedItemData } from '../fragments/curatedItemData';

/**
 * Get a list of curated items
 */
export const getCuratedItems = gql`
  query getCuratedItems(
    $filters: CuratedItemFilter
    $pagination: PaginationInput
  ) {
    getCuratedItems(filters: $filters, pagination: $pagination) {
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
          ...CuratedItemData
        }
      }
    }
  }
  ${CuratedItemData}
`;
