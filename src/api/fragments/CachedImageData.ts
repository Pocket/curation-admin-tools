import { gql } from '@apollo/client';

/**
 * TODO
 */
export const CachedImageData = gql`
  fragment CachedImageData on CachedImage {
    height
    id
    url
    width
  }
`;
