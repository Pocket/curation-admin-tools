import { gql } from '@apollo/client';
import { BaseSectionItemData } from '../fragments/SectionItemData';

export const createSectionItem = gql`
  ${BaseSectionItemData}
  mutation createSectionItem($data: CreateSectionItemInput!) {
    createSectionItem(data: $data) {
      ...BaseSectionItemData
    }
  }
`;
