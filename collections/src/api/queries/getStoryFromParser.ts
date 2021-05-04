import { gql } from '@apollo/client';

/**
 * Get author information by their external id.
 */
export const getStoryFromParser = gql`
  query getStoryFromParser($getItemByUrlUrl: String!) {
    getItemByUrl(url: $getItemByUrlUrl) {
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
