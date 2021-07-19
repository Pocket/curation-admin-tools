import { gql } from '@apollo/client';
import { CollectionPartnerData } from '../fragments/CollectionPartnerData';

/**
 * Update a collection partner's image url
 */
export const updateCollectionPartnerImageUrl = gql`
  mutation updateCollectionPartnerImageUrl(
    $externalId: String!
    $imageUrl: Url!
  ) {
    updateCollectionPartnerImageUrl(
      data: { externalId: $externalId, imageUrl: $imageUrl }
    ) {
      ...CollectionPartnerData
    }
  }
  ${CollectionPartnerData}
`;
