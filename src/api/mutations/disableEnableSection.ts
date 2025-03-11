import { gql } from '@apollo/client';
import { SectionData } from '../fragments/SectionData';

/**
 * Disables or enables a Section.
 */
export const disableEnableSection = gql`
  mutation disableEnableSection($data: DisableEnableSectionInput!) {
    disableEnableSection(data: $data) {
      ...SectionData
    }
  }
  ${SectionData}
`;
