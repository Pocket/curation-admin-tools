import { gql } from '@apollo/client';
import { CuratedItemData } from '../fragments/curatedItemData';

export const rejectApprovedItem = gql`
  mutation rejectApprovedItem($data: RejectApprovedCuratedCorpusItemInput!) {
    rejectApprovedCuratedCorpusItem(data: $data) {
      ...CuratedItemData
    }
  }
  ${CuratedItemData}
`;
