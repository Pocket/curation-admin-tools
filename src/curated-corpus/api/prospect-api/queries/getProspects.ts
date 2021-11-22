import { gql } from '@apollo/client';
import { ProspectData } from '../fragments/prospect';

/**
 * Get a list of prospects for a given New Tab GUID.
 */
export const getProspects = gql`
  query getProspects($newTab: String!, $prospectType: String) {
    getProspects(filters: { newTab: $newTab, prospectType: $prospectType }) {
      ...ProspectData
    }
  }
  ${ProspectData}
`;
