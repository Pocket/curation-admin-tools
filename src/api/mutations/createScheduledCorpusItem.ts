import { gql } from '@apollo/client';
import { CuratedItemData } from '../fragments/curatedItemData';

export const createScheduledCorpusItem = gql`
  mutation createScheduledCorpusItem(
    $approvedItemExternalId: ID!
    $scheduledSurfaceGuid: ID!
    $scheduledDate: Date!
    $source: ScheduledItemSource!
    $reasons: String
    $reasonComment: String
  ) {
    createScheduledCorpusItem(
      data: {
        approvedItemExternalId: $approvedItemExternalId
        scheduledSurfaceGuid: $scheduledSurfaceGuid
        scheduledDate: $scheduledDate
        source: $source
        reasons: $reasons
        reasonComment: $reasonComment
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
