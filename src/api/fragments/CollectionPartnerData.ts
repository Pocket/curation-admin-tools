import { gql } from '@apollo/client';
import { ImageData } from './ImageData';

/**
 * All the properties that are needed to display cards and forms with partner data
 */
export const CollectionPartnerData = gql`
  fragment CollectionPartnerData on CollectionPartner {
    externalId
    name
    url
    image {
      ...ImageData
    }
    imageUrl
    blurb
  }
  ${ImageData}
`;
