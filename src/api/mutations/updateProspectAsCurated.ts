import { gql } from '@apollo/client';
import { ProspectDataWithCorpusItems } from '../fragments/prospectWithCorpusItems';

export const updateProspectAsCurated = gql`
  mutation updateProspectAsCurated(
    $id: ID!
    $historyFilter: ApprovedCorpusItemScheduledSurfaceHistoryFilters
  ) {
    updateProspectAsCurated(id: $id) {
      ...ProspectDataWithCorpusItems
    }
  }
  ${ProspectDataWithCorpusItems}
`;
