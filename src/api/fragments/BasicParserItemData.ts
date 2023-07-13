import { gql } from '@apollo/client';

/**
 * A fragment for the Parser Item type. Being resolved on the Prospect type.
 */
export const BasicParserItemData = gql`
  fragment BasicParserItemData on Item {
    givenUrl
    itemId
    normalUrl
    datePublished
    timeToRead
  }
`;
