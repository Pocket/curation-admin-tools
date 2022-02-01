import { gql } from '@apollo/client';
import { RejectedItemData } from '../fragments/rejectedItemData';

export const rejectProspect = gql`
  mutation rejectProspect($data: CreateRejectedCuratedCorpusItemInput!) {
    createRejectedCuratedCorpusItem(data: $data) {
      ...RejectedItemData
    }
  }
  ${RejectedItemData}
`;
