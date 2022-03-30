import { gql } from '@apollo/client';
import { RejectedItemData } from '../fragments/rejectedItemData';

export const rejectProspect = gql`
  mutation rejectProspect($data: CreateRejectedCorpusItemInput!) {
    createRejectedCorpusItem(data: $data) {
      ...RejectedItemData
    }
  }
  ${RejectedItemData}
`;
