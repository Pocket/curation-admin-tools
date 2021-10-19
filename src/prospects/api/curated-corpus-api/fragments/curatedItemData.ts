import { gql } from '@apollo/client';

/**
 * Everything we need to fetch for a Curated Item
 */
export const CuratedItemData = gql`
  fragment CuratedItemData on CuratedItem {
    externalId
    title
    language
    url
    imageUrl
    excerpt
    status
    topic
    isCollection
    isShortLived
    isSyndicated
    createdBy
    createdAt
    updatedBy
    updatedAt
  }
`;
