import { gql } from '@apollo/client';
import { ScheduledItemData } from '../fragments/scheduledItemData';

export const getScheduledItems = gql`
  query getScheduledItems($filters: ScheduledCorpusItemsFilterInput!) {
    getScheduledCorpusItems(filters: $filters) {
      collectionCount
      syndicatedCount
      totalCount
      scheduledDate
      items {
        ...ScheduledItemData
      }
    }
  }
  ${ScheduledItemData}
`;
