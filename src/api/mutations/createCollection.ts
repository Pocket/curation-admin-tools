import { gql } from '@apollo/client';
import { CollectionData } from '../fragments/CollectionData';

/**
 * Create a collection
 */
export const createCollection = gql`
  mutation createCollection($data: CreateCollectionInput!) {
    createCollection(data: $data) {
      ...CollectionData
    }
  }
  ${CollectionData}
`;
