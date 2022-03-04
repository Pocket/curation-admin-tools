import { gql } from '@apollo/client';
import { ScheduledItemData } from '../fragments/scheduledItemData';

export const rescheduleScheduledItem = gql`
  mutation rescheduleScheduledCuratedCorpusItem(
    $externalId: ID!
    $scheduledDate: Date!
  ) {
    rescheduleScheduledCuratedCorpusItem(
      data: { externalId: $externalId, scheduledDate: $scheduledDate }
    ) {
      ...ScheduledItemData
    }
  }
  ${ScheduledItemData}
`;
