import { gql } from '@apollo/client';
import { ProspectData } from '../fragments/prospect';

export const updateProspectAsCurated = gql`
  mutation updateProspectAsCurated($prospectId: ID!) {
    updateProspectAsCurated(prospectId: $prospectId) {
      ...ProspectData
    }
  }
  ${ProspectData}
`;
