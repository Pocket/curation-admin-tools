import { gql } from '@apollo/client';
import { CuratedItemData } from '../fragments/curatedItemData';

/**
 * Get an approved curated item by its url
 */
export const getApprovedItemByUrl = gql`
  query getApprovedItemByUrl($url: String!) {
    getApprovedCorpusItemByUrl(url: $url) {
      ...CuratedItemData
    }
  }
  ${CuratedItemData}
`;
