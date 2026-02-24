import { gql } from '@apollo/client';
import { SectionItemData } from './SectionItemData';

export const BaseSectionData = gql`
  fragment BaseSectionData on Section {
    externalId
    title
    scheduledSurfaceGuid
    iab {
      taxonomy
      categories
    }
    sort
    createSource
    disabled
    active
    description
    heroTitle
    heroDescription
    startDate
    endDate
    status
    allowAds
    followable
  }
`;
export const SectionData = gql`
  fragment SectionData on Section {
    ...BaseSectionData
    sectionItems {
      ...SectionItemData
    }
    createdAt
    updatedAt
  }
  ${BaseSectionData}
  ${SectionItemData}
`;
