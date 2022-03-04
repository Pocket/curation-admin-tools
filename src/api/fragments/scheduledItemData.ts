import { gql } from '@apollo/client';
import { CuratedItemData } from './curatedItemData';

/**
 * TODO: fix comment
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
