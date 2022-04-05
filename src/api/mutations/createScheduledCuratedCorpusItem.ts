import { gql } from '@apollo/client';
import { CuratedItemData } from '../fragments/curatedItemData';

export const createScheduledCorpusItem = gql`
  mutation createScheduledCorpusItem(
    $approvedItemExternalId: ID!
    $scheduledSurfaceGuid: ID!
    $scheduledDate: Date!
  ) {
    createScheduledCorpusItem(
      data: {
        approvedItemExternalId: $approvedItemExternalId
        scheduledSurfaceGuid: $scheduledSurfaceGuid
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
