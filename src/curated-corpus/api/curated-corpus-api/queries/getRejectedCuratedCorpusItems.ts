import { gql } from '@apollo/client';
import { RejectedCuratedCorpusItemData } from '../fragments/rejectedCuratedCorpusItemData';

/**
 * Get a list of rejected curated items
 */
export const getRejectedCuratedCorpus = gql`
  query getRejectedCuratedCorpusItems(
    $filters: RejectedCuratedCorpusItemFilter
    $pagination: PaginationInput
  ) {
    getRejectedCuratedCorpusItems(filters: $filters, pagination: $pagination) {
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
          ...RejectedCuratedCorpusItemData
        }
      }
    }
  }
  ${RejectedCuratedCorpusItemData}
`;
