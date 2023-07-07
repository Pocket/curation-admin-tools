import { gql } from '@apollo/client';

/**
 * Get collection by its external id.
 */
export const getOpenGraphFields = gql`
  query getOpenGraphFields($url: Url!) {
    getOpenGraphFields(url: $url) {
      description
    }
  }
`;
