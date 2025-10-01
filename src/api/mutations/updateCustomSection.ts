import { gql } from '@apollo/client';
import { BaseSectionData } from '../fragments/SectionData';

export const updateCustomSection = gql`
  ${BaseSectionData}
  mutation updateCustomSection($data: UpdateCustomSectionInput!) {
    updateCustomSection(data: $data) {
      ...BaseSectionData
    }
  }
`;
