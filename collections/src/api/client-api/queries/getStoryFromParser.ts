import { gql } from '@apollo/client';

/**
 * Get author information by their external id.
 *
 * Note that we request the `topImageUrl` to get the publisher's preferred image
 * for a story, and if that's not there, the frontend will check the array of
 * `images` and pick the first image off there (this is usually the hero image).
 *
 * `domainMetadata.name` is fed into the 'Publisher' field on the frontend.
 */
export const getStoryFromParser = gql`
  query getStoryFromParser($url: String!) {
    getItemByUrl(url: $url) {
      resolvedUrl
      title
      excerpt
      topImageUrl
      images {
        src
        width
        height
      }
      authors {
        name
      }
      domainMetadata {
        name
      }
    }
  }
`;
