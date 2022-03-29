import { gql } from '@apollo/client';
import { CuratedItemData } from '../fragments/curatedItemData';

export const updateApprovedItem = gql`
  mutation updateApprovedCorpusItem($data: UpdateApprovedCorpusItemInput!) {
    updateApprovedCorpusItem(data: $data) {
      ...CuratedItemData
    }
  }
  ${CuratedItemData}
`;
