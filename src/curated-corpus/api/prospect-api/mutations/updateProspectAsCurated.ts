import { gql } from '@apollo/client';
import { ProspectData } from '../fragments/prospect';

export const rejectApprovedItem = gql`
  mutation updateProspectAsCurated($prospectId: String!) {
    updateProspectAsCurated(prospectId: $prospectId) {
      ...ProspectData
    }
  }
  ${ProspectData}
`;
