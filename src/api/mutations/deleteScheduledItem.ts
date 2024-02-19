import { gql } from '@apollo/client';
import { CuratedItemData } from '../fragments/curatedItemData';

export const deleteScheduledItem = gql`
  mutation deleteScheduledItem($data: DeleteScheduledCorpusItemInput!) {
    deleteScheduledCorpusItem(data: $data) {
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
