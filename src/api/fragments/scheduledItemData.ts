import { gql } from '@apollo/client';
import { CuratedItemData } from './curatedItemData';

/**
 * All the fields for a Scheduled Corpus Item
 */
export const ScheduledItemData = gql`
  fragment ScheduledItemData on ScheduledCorpusItem {
    approvedItem {
      ...CuratedItemData
    }
    scheduledSurfaceGuid
    createdAt
    createdBy
    externalId
    scheduledDate
    updatedAt
    updatedBy
  }
  ${CuratedItemData}
`;
