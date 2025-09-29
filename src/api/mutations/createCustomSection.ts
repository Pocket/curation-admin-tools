import { gql } from '@apollo/client';
import { BaseSectionData } from '../fragments/SectionData';

/**
 * Create a custom section
 */
export const createCustomSection = gql`
  mutation createCustomSection($data: CreateCustomSectionInput!) {
    createCustomSection(data: $data) {
      ...BaseSectionData
    }
  }
  ${BaseSectionData}
`;
