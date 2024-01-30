import { gql } from '@apollo/client';
import { ProspectData } from '../fragments/prospect';

export const removeProspect = gql`
  mutation RemoveProspect($data: RemoveProspectInput!) {
    removeProspect(data: $data) {
      ...ProspectData
    }
  }
  ${ProspectData}
`;
