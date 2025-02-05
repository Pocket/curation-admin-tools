import { gql } from '@apollo/client';
import { ScheduledItemData } from '../fragments/scheduledItemData';

export const rescheduleScheduledItem = gql`
  mutation rescheduleScheduledCorpusItem(
    $externalId: ID!
    $scheduledDate: Date!
    $source: ActivitySource!
    $actionScreen: ActionScreen
  ) {
    rescheduleScheduledCorpusItem(
      data: {
        externalId: $externalId
        scheduledDate: $scheduledDate
        source: $source
        actionScreen: $actionScreen
      }
    ) {
      ...ScheduledItemData
    }
  }
  ${ScheduledItemData}
`;
