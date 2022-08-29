import { gql } from '@apollo/client';
import { CollectionPartnerAssociationData } from '../fragments/CollectionPartnerAssociationData';

/**
 * Update a collection-partner association
 */
export const updateCollectionPartnerAssociation = gql`
  mutation updateCollectionPartnerAssociation(
    $externalId: String!
    $type: CollectionPartnershipType!
    $partnerExternalId: String!
    $name: String
    $url: Url
    $imageUrl: Url
    $blurb: Markdown
    $imageOptions: [CachedImageInput!]!
  ) {
    updateCollectionPartnerAssociation(
      data: {
        externalId: $externalId
        type: $type
        partnerExternalId: $partnerExternalId
        name: $name
        url: $url
        imageUrl: $imageUrl
        blurb: $blurb
      }
    ) {
      ...CollectionPartnerAssociationData
    }
  }
  ${CollectionPartnerAssociationData}
`;
