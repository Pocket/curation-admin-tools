import { gql } from '@apollo/client';

/**
 * Get a list of Scheduled Surfaces the authenticated user has access to.
 */
export const getScheduledSurfacesForUser = gql`
  query getScheduledSurfacesForUser {
    getScheduledSurfacesForUser {
      guid
      name
      prospectTypes
      ianaTimezone
    }
  }
`;
