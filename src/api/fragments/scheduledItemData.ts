import { gql } from '@apollo/client';
import { CuratedItemData } from './curatedItemData';

/**
 * All the fields for a Scheduled Curated Corpus Item
 */
export const ScheduledItemData = gql`
  fragment ScheduledItemData on ScheduledCuratedCorpusItem {
    approvedItem {
      ...CuratedItemData
    }
    createdAt
    createdBy
    externalId
    scheduledDate
    updatedAt
    updatedBy
  }
  ${CuratedItemData}
`;
