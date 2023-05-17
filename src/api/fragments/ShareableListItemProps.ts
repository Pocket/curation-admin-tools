import { gql } from 'graphql-tag';

/**
 * This GraphQL fragment contains all the properties that must be available
 * in the Admin Pocket Graph for a Shareable List Item.
 */
export const ShareableListItemProps = gql`
  fragment ShareableListItemProps on ShareableListItemAdmin {
    externalId
    itemId
    url
    title
    excerpt
    imageUrl
    publisher
    authors
    note
    sortOrder
    createdAt
    updatedAt
  }
`;
