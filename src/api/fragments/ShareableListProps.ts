import { gql } from 'graphql-tag';

/**
 * This GraphQL fragment contains all the properties that must be available
 * in the Admin Pocket Graph for a Shareable List.
 */
export const ShareableListProps = gql`
  fragment ShareableListProps on ShareableList {
    externalId
    userId
    title
    description
    slug
    status
    moderationStatus
    moderatedBy
    moderationReason
    createdAt
    updatedAt
  }
`;
