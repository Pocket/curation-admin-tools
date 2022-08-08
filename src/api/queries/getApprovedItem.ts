import { gql } from '@apollo/client';
import { CuratedItemDataWithHistory } from '../fragments/CuratedItemWithHistory';

/**
 * Get an approved corpus item by its external ID
 */
export const getApprovedItem = gql`
  query approvedCorpusItem(
    $externalId: ID!
    $historyFilter: ApprovedCorpusItemScheduledSurfaceHistoryFilters
  ) {
    approvedCorpusItem(externalId: $externalId) {
      ...CuratedItemDataWithHistory
    }
  }
  ${CuratedItemDataWithHistory}
`;
