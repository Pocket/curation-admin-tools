import { gql } from '@apollo/client';
import { SectionItemData } from '../fragments/SectionItemData';

export const removeSectionItem = gql`
  mutation RemoveSectionItem($data: RemoveSectionItemInput!) {
    removeSectionItem(data: $data) {
      ...SectionItemData
    }
  }
  ${SectionItemData}
`;
