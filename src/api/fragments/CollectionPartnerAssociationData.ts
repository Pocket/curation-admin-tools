import { gql } from '@apollo/client';
import { CollectionPartnerData } from './CollectionPartnerData';
import { ImageData } from './ImageData';

/**
 * All the properties that are needed to display cards and forms
 * for collection-partner associations
 */
export const CollectionPartnerAssociationData = gql`
  fragment CollectionPartnerAssociationData on CollectionPartnerAssociation {
    externalId
    type
    name
    url
    image {
      ...ImageData
    }
    imageUrl
    blurb
    partner {
      ...CollectionPartnerData
    }
  }
  ${CollectionPartnerData}
  ${ImageData}
`;
