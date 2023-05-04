import { gql } from 'graphql-tag';
import { ShareableListItemProps } from './ShareableListItemProps';

/**
 * This GraphQL fragment contains all the properties that must be available
 * in the Admin Pocket Graph for a Shareable List with moderation-related properties.
 */
export const ShareableListCompleteProps = gql`
  fragment ShareableListCompleteProps on ShareableListComplete {
    externalId
    title
    description
    slug
    status
    moderationStatus
    createdAt
    updatedAt
    moderatedBy
    moderationReason
    moderationDetails
    restorationReason
    listItemNoteVisibility
    listItems {
      ...ShareableListItemProps
    }
    user {
      id
    }
  }
  ${ShareableListItemProps}
`;
