import { gql } from '@apollo/client';

/**
 * All the fields for a Rejected Corpus Item
 */
export const RejectedItemData = gql`
  fragment RejectedItemData on RejectedCorpusItem {
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
