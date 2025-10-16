import { gql } from '@apollo/client';

export const deleteCustomSection = gql`
  mutation deleteCustomSection($externalId: ID!) {
    deleteCustomSection(externalId: $externalId) {
      externalId
      title
    }
  }
`;
