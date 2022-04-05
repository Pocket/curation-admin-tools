import { gql } from '@apollo/client';

export const getScheduledItemCounts = gql`
  query getScheduledItemCounts($filters: ScheduledCorpusItemsFilterInput!) {
    getScheduledCorpusItems(filters: $filters) {
      collectionCount
      syndicatedCount
      totalCount
    }
  }
`;
