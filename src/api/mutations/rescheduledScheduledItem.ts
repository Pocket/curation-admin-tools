import { gql } from '@apollo/client';
import { ScheduledItemData } from '../fragments/scheduledItemData';

export const rescheduleScheduledItem = gql`
  mutation rescheduleScheduledCorpusItem(
    $externalId: ID!
    $scheduledDate: Date!
  ) {
    rescheduleScheduledCorpusItem(
      data: { externalId: $externalId, scheduledDate: $scheduledDate }
    ) {
      ...ScheduledItemData
    }
  }
  ${ScheduledItemData}
`;
