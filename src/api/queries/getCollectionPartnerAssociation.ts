import { gql } from '@apollo/client';
import { CollectionPartnerAssociationData } from '../fragments/CollectionPartnerAssociationData';

/**
 * Get collection-partner association information by the external id.
 * of the collection it's related to.
 */
export const getCollectionPartnerAssociation = gql`
  query getCollectionPartnerAssociation(
    $externalId: String!
    $imageOptions: [CachedImageInput!]!
  ) {
    getCollectionPartnerAssociationForCollection(externalId: $externalId) {
      ...CollectionPartnerAssociationData
    }
  }
  ${CollectionPartnerAssociationData}
`;
