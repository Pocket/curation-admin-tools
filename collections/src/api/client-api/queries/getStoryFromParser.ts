import { gql } from '@apollo/client';

/**
 * Get author information by their external id.
 */
export const getStoryFromParser = gql`
  query getStoryFromParser($url: String!) {
    getItemByUrl(url: $url) {
      resolvedUrl
      title
      excerpt
      topImageUrl
      authors {
        name
      }
      domainMetadata {
        name
      }
    }
  }
`;
