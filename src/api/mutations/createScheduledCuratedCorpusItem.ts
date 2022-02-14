import { gql } from '@apollo/client';
import { CuratedItemData } from '../fragments/curatedItemData';

export const createScheduledCuratedCorpusItem = gql`
  mutation createScheduledCuratedCorpusItem(
    $approvedItemExternalId: ID!
    $scheduledSurfaceGuid: ID!
    $scheduledDate: Date!
  ) {
    createScheduledCuratedCorpusItem(
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
