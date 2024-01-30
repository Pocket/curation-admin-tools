import { gql } from '@apollo/client';
import { ProspectData } from '../fragments/prospect';

export const dismissProspect = gql`
  mutation RemoveProspect($data: RemoveProspectInput!) {
    removeProspect(data: $data) {
      ...ProspectData
    }
  }
  ${ProspectData}
`;
