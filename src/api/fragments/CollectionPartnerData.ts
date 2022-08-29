import { gql } from '@apollo/client';

/**
 * All the properties that are needed to display cards and forms with partner data
 */
export const CollectionPartnerData = gql`
  fragment CollectionPartnerData on CollectionPartner {
    externalId
    name
    url
    image {
      cachedImages(imageOptions: $imageOptions) {
        height
        id
        url
        width
      }
      caption
      credit
      height
      imageId
      targetUrl
      url
      width
    }
    blurb
  }
`;
