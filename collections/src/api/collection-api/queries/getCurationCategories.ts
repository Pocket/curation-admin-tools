import { gql } from '@apollo/client';

/**
 * Get a list of curation categories
 */
export const getCurationCategories = gql`
  query getCurationCategories {
    getCurationCategories {
      externalId
      name
      slug
    }
  }
`;
