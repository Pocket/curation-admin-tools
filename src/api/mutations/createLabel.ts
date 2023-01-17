import { gql } from '@apollo/client';
/**
 * Create a label
 */
export const createLabel = gql`
  mutation createLabel($name: String!) {
    createLabel(name: $name) {
      externalId
      name
    }
  }
`;
