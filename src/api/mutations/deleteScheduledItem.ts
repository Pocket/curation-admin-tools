import { gql } from '@apollo/client';
import { CuratedItemData } from '../fragments/curatedItemData';

export const deleteScheduledItem = gql`
  mutation deleteScheduledItem($externalId: ID!) {
    deleteScheduledCorpusItem(data: { externalId: $externalId }) {
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
  ${CuratedItemData}
`;
