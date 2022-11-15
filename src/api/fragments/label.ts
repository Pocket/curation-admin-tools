import { gql } from '@apollo/client';

/**
 * Label type
 */
export const labelData = gql`
  fragment labelData on Label {
    externalId
    name
  }
`;
