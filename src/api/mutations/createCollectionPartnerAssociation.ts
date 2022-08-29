import { gql } from '@apollo/client';
import { CollectionPartnerAssociationData } from '../fragments/CollectionPartnerAssociationData';

/**
 * Create a collection-partner association
 */
export const createCollectionPartnerAssociation = gql`
  mutation createCollectionPartnerAssociation(
    $type: CollectionPartnershipType!
    $partnerExternalId: String!
    $collectionExternalId: String!
    $name: String
    $url: Url
    $imageUrl: Url
    $blurb: Markdown
    $imageOptions: [CachedImageInput!]!
  ) {
    createCollectionPartnerAssociation(
      data: {
        type: $type
        partnerExternalId: $partnerExternalId
        collectionExternalId: $collectionExternalId
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
