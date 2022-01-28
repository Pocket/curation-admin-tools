import { gql } from '@apollo/client';
import { CuratedItemData } from '../fragments/curatedItemData';

export const createApprovedItem = gql`
  mutation createApprovedCuratedCorpusItem(
    $data: CreateApprovedCuratedCorpusItemInput!
  ) {
    createApprovedCuratedCorpusItem(data: $data) {
      ...CuratedItemData
    }
  }
  ${CuratedItemData}
`;
