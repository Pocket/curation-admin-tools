import { gql } from '@apollo/client';
import { ProspectData } from '../fragments/prospect';

export const updateProspectAsCurated = gql`
  mutation updateProspectAsCurated($id: ID!) {
    updateProspectAsCurated(id: $id) {
      ...ProspectData
    }
  }
  ${ProspectData}
`;
