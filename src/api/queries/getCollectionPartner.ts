import { gql } from '@apollo/client';
import { CollectionPartnerData } from '../fragments/CollectionPartnerData';

/**
 * Get partner information by their external id.
 */
export const getCollectionPartner = gql`
  query getCollectionPartner(
    $id: String!
    $imageOptions: [CachedImageInput!]!
  ) {
    getCollectionPartner(externalId: $id) {
      ...CollectionPartnerData
    }
  }
  ${CollectionPartnerData}
`;
