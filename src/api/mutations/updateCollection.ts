import { gql } from '@apollo/client';
import { CollectionData } from '../fragments/CollectionData';

/**
 * Update a collection
 */
export const updateCollection = gql`
  mutation updateCollection($data: UpdateCollectionInput!) {
    updateCollection(data: $data) {
      ...CollectionData
    }
  }
  ${CollectionData}
`;
