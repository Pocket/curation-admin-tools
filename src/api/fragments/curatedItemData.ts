import { gql } from '@apollo/client';

/**
 * Everything we need to fetch for a Curated Item
 */
export const CuratedItemData = gql`
  fragment CuratedItemData on ApprovedCuratedCorpusItem {
    externalId
    prospectId
    title
    language
    publisher
    url
    imageUrl
    excerpt
    status
    topic
    isCollection
    isTimeSensitive
    isSyndicated
    createdBy
    createdAt
    updatedBy
    updatedAt
  }
`;
