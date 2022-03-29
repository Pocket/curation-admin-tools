import { gql } from '@apollo/client';
import { CuratedItemData } from '../fragments/curatedItemData';

export const createApprovedItem = gql`
  mutation createApprovedCorpusItem($data: CreateApprovedCorpusItemInput!) {
    createApprovedCorpusItem(data: $data) {
      ...CuratedItemData
    }
  }
  ${CuratedItemData}
`;
