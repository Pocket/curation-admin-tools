import { gql } from '@apollo/client';

/**
 * Everything we need to fetch for a Curated Item
 */
export const CuratedItemDataWithHistory = gql`
  fragment CuratedItemDataWithHistory on ApprovedCorpusItem {
    externalId
    prospectId
    title
    language
    publisher
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
    scheduledSurfaceHistory(filters: $historyFilter) {
      externalId
      createdBy
      scheduledDate
      scheduledSurfaceGuid
    }
  }
`;
