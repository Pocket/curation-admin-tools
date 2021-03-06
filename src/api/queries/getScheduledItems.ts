import { gql } from '@apollo/client';
import { CuratedItemData } from '../fragments/curatedItemData';

export const getScheduledItems = gql`
  query getScheduledItems($filters: ScheduledCorpusItemsFilterInput!) {
    getScheduledCorpusItems(filters: $filters) {
      collectionCount
      syndicatedCount
      totalCount
      scheduledDate
      items {
        externalId
        createdAt
        createdBy
        updatedAt
        updatedBy
        scheduledDate
        scheduledSurfaceGuid
        approvedItem {
          ...CuratedItemData
        }
      }
    }
  }
  ${CuratedItemData}
`;
