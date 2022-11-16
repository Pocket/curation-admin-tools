import { gql } from '@apollo/client';
import { ProspectData } from '../fragments/prospect';

export const dismissProspect = gql`
  mutation dismissProspect($id: ID!) {
    dismissProspect(id: $id) {
      ...ProspectData
    }
  }
  ${ProspectData}
`;
