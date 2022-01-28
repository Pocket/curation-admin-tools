import { gql } from '@apollo/client';

export const getScheduledItemCounts = gql`
  query getScheduledItemCounts(
    $filters: ScheduledCuratedCorpusItemsFilterInput!
  ) {
    getScheduledCuratedCorpusItems(filters: $filters) {
      collectionCount
      syndicatedCount
      totalCount
    }
  }
`;
