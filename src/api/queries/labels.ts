import { gql } from '@apollo/client';
import { labelData } from '../fragments/label';

/**
 * Get all the labels that are available and can be assigned to a collection.
 */
export const labels = gql`
  query labels {
    labels {
      ...labelData
    }
  }
  ${labelData}
`;
