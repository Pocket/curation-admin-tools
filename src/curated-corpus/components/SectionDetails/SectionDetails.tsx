import React, { ReactElement } from 'react';
import { Section, SectionItem } from '../../../api/generatedTypes';
import { Box, Grid } from '@mui/material';
import { SectionItemCardWrapper } from '../SectionItemCardWrapper/SectionItemCardWrapper';

interface SectionDetailsProps {
  /**
   * All sections for a selected scheduled surface
   */
  sections: Section[];
  /**
   * The current section selected by user
   */
  currentSection: string;
  /**
   * The current surface selected by user
   */
  currentScheduledSurfaceGuid: string;
}
export const SectionDetails: React.FC<SectionDetailsProps> = (
  props,
): ReactElement => {
  const { sections, currentSection, currentScheduledSurfaceGuid } = props;
  return (
    <>
      {sections &&
        sections
          .filter(
            (section) =>
              currentSection === 'all' || section.title === currentSection,
          )
          .map((section: Section) => (
            <>
              <Box mt={9} mb={3}>
                <h2>{section.title}</h2>
                <p>{section.active}</p>
              </Box>
              <Grid
                container
                alignItems="stretch"
                spacing={3}
                justifyContent="flex-start"
                key={section.externalId}
              >
                <Grid item xs={12}>
                  <Grid container spacing={2}>
                    {section.sectionItems.map((item: SectionItem) => {
                      {
                        return (
                          <SectionItemCardWrapper
                            key={item.externalId}
                            item={item.approvedItem}
                            // TODO: wire up edit action https://mozilla-hub.atlassian.net/browse/MC-1656
                            onEdit={() => {}}
                            // TODO: wire up reject/remove action https://mozilla-hub.atlassian.net/browse/MC-1656
                            onReject={() => {}}
                            scheduledSurfaceGuid={currentScheduledSurfaceGuid}
                          />
                        );
                      }
                    })}
                  </Grid>
                </Grid>
              </Grid>
            </>
          ))}
    </>
  );
};
