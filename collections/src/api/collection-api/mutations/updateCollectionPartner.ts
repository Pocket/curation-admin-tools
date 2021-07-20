import { gql } from '@apollo/client';
import { CollectionPartnerData } from '../fragments/CollectionPartnerData';

/**
 * Update a collection partner
 */
export const createCollectionPartner = gql`
  mutation updateCollectionPartner(
    $externalId: String!
    $name: String!
    $url: Url!
    $blurb: Markdown!
    $imageUrl: Url
  ) {
    updateCollectionPartner(
      data: {
        externalId: $externalId
        name: $name
        url: $url
        blurb: $blurb
        imageUrl: $imageUrl
      }
    ) {
      ...CollectionPartnerData
    }
  }
  ${CollectionPartnerData}
`;
