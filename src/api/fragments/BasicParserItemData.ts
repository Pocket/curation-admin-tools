import { gql } from '@apollo/client';

/**
 * Everything we need to fetch for a Curated Item
 */
export const BasicParserItemData = gql`
  fragment BasicParserItemData on Item {
    givenUrl
    itemId
    normalUrl
    datePublished
  }
`;
