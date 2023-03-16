import { gql } from 'graphql-tag';

/**
 * This GraphQL fragment contains all the properties that must be available
 * in the Public Pocket Graph for a Shareable List Item.
 */
export const ShareableListItemProps = gql`
  fragment ShareableListItemProps on ShareableListItem {
    externalId
    itemId
    url
    title
    excerpt
    imageUrl
    publisher
    authors
    sortOrder
    createdAt
    updatedAt
  }
`;
