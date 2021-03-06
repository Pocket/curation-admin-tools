import { gql } from '@apollo/client';
import { CollectionData } from '../fragments/CollectionData';

/**
 * Get collection by its external id.
 */
export const getCollectionById = gql`
  query getCollectionByExternalId($externalId: String!) {
    getCollection(externalId: $externalId) {
      ...CollectionData
    }
  }
  ${CollectionData}
`;
