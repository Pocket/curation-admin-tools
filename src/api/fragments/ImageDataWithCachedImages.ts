import { gql } from '@apollo/client';
import { CachedImageData } from './CachedImageData';

/**
 * TODO
 */
export const ImageDataWithCachedImages = gql`
  fragment ImageDataWithCachedImages on Image {
    cachedImages(imageOptions: $imageOptions) {
      ...CachedImageData
    }
    caption
    credit
    height
    imageId
    targetUrl
    url
    width
  }
  ${CachedImageData}
`;
