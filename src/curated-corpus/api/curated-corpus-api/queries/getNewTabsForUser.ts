import { gql } from '@apollo/client';

/**
 * Get a list of New Tabs the authenticated user has access to.
 */
export const getNewTabsForUser = gql`
  query getNewTabsForUser {
    getNewTabsForUser {
      guid
      name
      utcOffset
      prospectTypes
    }
  }
`;
