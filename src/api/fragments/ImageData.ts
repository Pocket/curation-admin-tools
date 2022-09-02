import { gql } from '@apollo/client';

/**
 * TODO
 * does not include deprecated `src`
 */
export const ImageData = gql`
  fragment ImageData on Image {
    caption
    credit
    height
    targetUrl
    url
    width
  }
`;
