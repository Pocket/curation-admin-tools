import { gql } from '@apollo/client';
import { ProspectData } from '../fragments/prospect';

export const updateProspectAsCurated = gql`
  mutation updateProspectAsCurated(
    $id: ID!
    $historyFilter: ApprovedCorpusItemScheduledSurfaceHistoryFilters
  ) {
    updateProspectAsCurated(id: $id) {
      ...ProspectData
    }
  }
  ${ProspectData}
`;
