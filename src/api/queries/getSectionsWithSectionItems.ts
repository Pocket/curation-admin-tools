import { gql } from '@apollo/client';
import { SectionData } from '../fragments/SectionData';

/**
 * Retrieve all active Sections with their active SectionItems for a given ScheduledSurface.
 * Returns an empty array if no Sections found.
 */
export const getSectionsWithSectionItems = gql`
  query getSectionsWithSectionItems($scheduledSurfaceGuid: ID!, $createSource: ActivitySource) {
    getSectionsWithSectionItems(scheduledSurfaceGuid: $scheduledSurfaceGuid, createSource: $createSource) {
      ...SectionData
    }
  }
  ${SectionData}
`;
