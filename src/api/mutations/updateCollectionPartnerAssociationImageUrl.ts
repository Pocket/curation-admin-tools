import { gql } from '@apollo/client';
import { CollectionPartnerAssociationData } from '../fragments/CollectionPartnerAssociationData';

/**
 * Update the image URL for a collection-partner association
 */
export const updateCollectionPartnerAssociationImageUrl = gql`
  mutation updateCollectionPartnerAssociationImageUrl(
    $externalId: String!
    $imageUrl: Url!
    $imageOptions: [CachedImageInput!]!
  ) {
    updateCollectionPartnerAssociationImageUrl(
      data: { externalId: $externalId, imageUrl: $imageUrl }
    ) {
      ...CollectionPartnerAssociationData
    }
  }
  ${CollectionPartnerAssociationData}
`;
