import { gql } from '@apollo/client';
import { ScheduledItemData } from '../fragments/scheduledItemData';

export const rescheduleScheduledItem = gql`
  mutation rescheduleScheduledCorpusItem(
    $externalId: ID!
    $scheduledDate: Date!
    $scheduledSource: ScheduledItemSource
  ) {
    rescheduleScheduledCorpusItem(
      data: {
        externalId: $externalId
        scheduledDate: $scheduledDate
        scheduledSource: $scheduledSource
      }
    ) {
      ...ScheduledItemData
    }
  }
  ${ScheduledItemData}
`;
