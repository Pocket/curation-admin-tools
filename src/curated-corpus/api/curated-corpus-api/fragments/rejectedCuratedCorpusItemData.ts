import { gql } from '@apollo/client';

/**
 * All the fields for a Rejected Curated Corpus Item
 */
export const RejectedCuratedCorpusItemData = gql`
  fragment RejectedCuratedCorpusItemData on RejectedCuratedCorpusItem {
    externalId
    url
    title
    topic
    language
    publisher
    reason
    createdBy
    createdAt
  }
`;
