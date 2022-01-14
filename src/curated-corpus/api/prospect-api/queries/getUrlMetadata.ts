import { gql } from '@apollo/client';
import { urlMetadata } from '../fragments/urlMetadata';

/**
 * Get meta data from the parser/client api for an item's URL.
 */
export const getUrlMetadata = gql`
  query getUrlMetadata($url: String!) {
    getUrlMetadata(url: $url) {
      ...urlMetadata
    }
  }
  ${urlMetadata}
`;
