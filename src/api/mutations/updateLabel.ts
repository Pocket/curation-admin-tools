import { gql } from '@apollo/client';

/**
 * Updates a label not associated with a collection.
 */
export const updateLabel = gql`
  mutation updateLabel($data: UpdateLabelInput!) {
    updateLabel(data: $data) {
      externalId
      name
    }
  }
`;
