import { gql } from '@apollo/client';
import { CuratedItemData } from '../fragments/curatedItemData';

export const updateApprovedItem = gql`
  mutation updateApprovedCuratedCorpusItem(
    $data: UpdateApprovedCuratedCorpusItemInput!
  ) {
    updateApprovedCuratedCorpusItem(data: $data) {
      ...CuratedItemData
    }
  }
  ${CuratedItemData}
`;
