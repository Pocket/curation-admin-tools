import { gql } from '@apollo/client';
import { ProspectDataWithCorpusItems } from '../fragments/prospectWithCorpusItems';

/**
 * Get a list of prospects for a given Scheduled Service GUID.
 */
export const getProspects = gql`
  query getProspects(
    $scheduledSurfaceGuid: String!
    $prospectType: String
    $historyFilter: ApprovedCorpusItemScheduledSurfaceHistoryFilters
  ) {
    getProspects(
      filters: {
        scheduledSurfaceGuid: $scheduledSurfaceGuid
        prospectType: $prospectType
      }
    ) {
      ...ProspectDataWithCorpusItems
    }
  }
  ${ProspectDataWithCorpusItems}
`;
