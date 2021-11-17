import { gql } from '@apollo/client';

/**
 * All the fields for a Rejected Curated Corpus Item
 */
export const RejectedItemData = gql`
  fragment RejectedItemData on RejectedCuratedCorpusItem {
    externalId
    prospectId
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
