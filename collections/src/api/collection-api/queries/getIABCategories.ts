import { gql } from '@apollo/client';

/**
 * Get a list of IAB categories
 */
export const getIABCategories = gql`
  query getIABCategories {
    getIABCategories {
      externalId
      name
      slug
      children {
        externalId
        name
        slug
      }
    }
  }
`;
