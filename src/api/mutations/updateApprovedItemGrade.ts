import { gql } from '@apollo/client';
import { CuratedItemData } from '../fragments/curatedItemData';

export const updateApprovedItemGrade = gql`
  mutation updateApprovedCorpusItemGrade(
    $data: UpdateApprovedCorpusItemGradeInput!
  ) {
    updateApprovedCorpusItemGrade(data: $data) {
      ...CuratedItemData
    }
  }
  ${CuratedItemData}
`;
