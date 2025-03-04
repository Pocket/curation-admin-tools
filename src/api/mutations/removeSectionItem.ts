import { gql } from '@apollo/client';
import { SectionItemData } from '../fragments/SectionItemData';

export const removeSectionItem = gql`
  mutation RemoveSectionItem($externalId: String!) {
    removeSectionItem(externalId: $externalId) {
      ...SectionItemData
    }
  }
  ${SectionItemData}
`;
