import { gql } from '@apollo/client';

/**
 * Everything we need to fetch for a Curated Item
 */
export const CuratedItemData = gql`
  fragment CuratedItemData on ApprovedCorpusItem {
    externalId
    prospectId
    title
    language
    publisher
    datePublished
    authors {
      name
      sortOrder
    }
    url
    imageUrl
    excerpt
    status
    source
    topic
    isCollection
    isTimeSensitive
    isSyndicated
    createdBy
    createdAt
    updatedBy
    updatedAt
    scheduledSurfaceHistory {
      externalId
      createdBy
      scheduledDate
      scheduledSurfaceGuid
    }
  }
`;
