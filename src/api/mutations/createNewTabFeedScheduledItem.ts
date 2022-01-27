import { gql } from '@apollo/client';
import { CuratedItemData } from '../fragments/curatedItemData';

export const createNewTabFeedScheduledItem = gql`
  mutation createNewTabFeedScheduledItem(
    $approvedItemExternalId: ID!
    $newTabGuid: ID!
    $scheduledDate: Date!
  ) {
    createScheduledCuratedCorpusItem(
      data: {
        approvedItemExternalId: $approvedItemExternalId
        newTabGuid: $newTabGuid
        scheduledDate: $scheduledDate
      }
    ) {
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
