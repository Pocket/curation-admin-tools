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
    $blurb: Markdown
    $imageUrl: Url
  ) {
    updateCollectionPartnerAssociation(
      data: {
        externalId: $externalId
        type: $type
        partnerExternalId: $partnerExternalId
        name: $name
        url: $url
        blurb: $blurb
        imageUrl: $imageUrl
      }
    ) {
      ...CollectionPartnerAssociationData
    }
  }
  ${CollectionPartnerAssociationData}
`;
