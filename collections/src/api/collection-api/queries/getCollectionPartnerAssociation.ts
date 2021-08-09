import { gql } from '@apollo/client';
import { CollectionPartnerAssociationData } from '../fragments/CollectionPartnerAssociationData';

/**
 * Get collection-partner association information by its external id.
 */
export const getCollectionPartnerAssociation = gql`
  query getCollectionPartnerAssociation($externalId: String!) {
    getCollectionPartnerAssociation(externalId: $externalId) {
      ...CollectionPartnerAssociationData
    }
  }
  ${CollectionPartnerAssociationData}
`;
