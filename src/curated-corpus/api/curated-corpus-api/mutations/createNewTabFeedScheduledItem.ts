import { gql } from '@apollo/client';
import { CuratedItemData } from '../fragments/curatedItemData';

export const createNewTabFeedScheduledItem = gql`
  mutation createNewTabFeedScheduledItem(
    $curatedItemExternalId: ID!
    $newTabGuid: ID!
    $scheduledDate: Date!
  ) {
    createNewTabFeedScheduledItem(
      data: {
        curatedItemExternalId: $curatedItemExternalId
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
      curatedItem {
        ...CuratedItemData
      }
    }
  }
  ${CuratedItemData}
`;
