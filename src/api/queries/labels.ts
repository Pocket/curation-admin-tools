import { gql } from '@apollo/client';

export const labels = gql`
  query labels {
    labels {
      externalId
      name
    }
  }
`;
