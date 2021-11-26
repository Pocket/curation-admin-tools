import { gql } from '@apollo/client';
import { CuratedItemData } from '../fragments/curatedItemData';

export const getScheduledItems = gql`
  query getScheduledItems($filters: ScheduledCuratedCorpusItemsFilterInput!) {
    getScheduledCuratedCorpusItems(filters: $filters) {
      items {
        externalId
        createdAt
        createdBy
        updatedAt
        updatedBy
        scheduledDate
        approvedItem {
          ...CuratedItemData
        }
      }
    }
  }
  ${CuratedItemData}
`;
