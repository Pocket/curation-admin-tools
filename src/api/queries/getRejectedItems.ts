import { gql } from '@apollo/client';
import { RejectedItemData } from '../fragments/rejectedItemData';

/**
 * Get a list of rejected curated items
 */
export const getRejectedItems = gql`
  query getRejectedItems(
    $filters: RejectedCorpusItemFilter
    $pagination: PaginationInput
  ) {
    getRejectedCorpusItems(filters: $filters, pagination: $pagination) {
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
          ...RejectedItemData
        }
      }
    }
  }
  ${RejectedItemData}
`;
