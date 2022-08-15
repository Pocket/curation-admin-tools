import { gql } from '@apollo/client';
import { CuratedItemDataWithHistory } from '../fragments/CuratedItemWithHistory';

/**
 * Get an approved corpus item by its external ID
 */
export const approvedItemByExternalId = gql`
  query approvedCorpusItemByExternalId(
    $externalId: ID!
    $historyFilter: ApprovedCorpusItemScheduledSurfaceHistoryFilters
  ) {
    approvedCorpusItemByExternalId(externalId: $externalId) {
      ...CuratedItemDataWithHistory
    }
  }
  ${CuratedItemDataWithHistory}
`;
