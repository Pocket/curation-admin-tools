import { gql } from '@apollo/client';
import { CuratedItemData } from './curatedItemData';

export const BaseSectionItemData = gql`
  fragment BaseSectionItemData on SectionItem {
    externalId
    rank
  }
`;

export const SectionItemData = gql`
  fragment SectionItemData on SectionItem {
    ...BaseSectionItemData
    approvedItem {
      ...CuratedItemData
    }
    createdAt
    updatedAt
  }
  ${BaseSectionItemData}
  ${CuratedItemData}
`;
