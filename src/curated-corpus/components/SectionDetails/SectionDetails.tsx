import React, { ReactElement } from 'react';
import {
  Section,
  SectionItem,
  useDisableEnableSectionMutation,
  useRemoveSectionItemMutation,
} from '../../../api/generatedTypes';
import { Box, FormControlLabel, FormGroup, Grid, Switch } from '@mui/material';
import { SectionItemCardWrapper } from '../SectionItemCardWrapper/SectionItemCardWrapper';
import { useRunMutation } from '../../../_shared/hooks';

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
   * Callback to set the current approved corpus item (to work on, e.g. edit or remove)
   * on the Sections Page.
   */
  setCurrentSectionItem: React.Dispatch<
    React.SetStateAction<Omit<SectionItem, '__typename'> | undefined>
  >;
  /**
   * The current surface selected by user
   */
  currentScheduledSurfaceGuid: string;
  /**
   * A toggle function for the "Edit this item" modal.
   */
  toggleEditModal: VoidFunction;
  /**
   * A function that triggers a new API call to refetch the data for a given
   * query. Needed on the Schedule page to refresh data after every action.
   */
  refetch?: VoidFunction;
}
export const SectionDetails: React.FC<SectionDetailsProps> = (
  props,
): ReactElement => {
  const {
    sections,
    currentSection,
    setCurrentSectionItem,
    currentScheduledSurfaceGuid,
    toggleEditModal,
    refetch,
  } = props;

  // Get a helper function that will execute each mutation, show standard notifications
  // and execute any additional actions in a callback
  const { runMutation } = useRunMutation();

  const [removeSectionItemMutation] = useRemoveSectionItemMutation();

  const removeSectionItem = (externalId: string): void => {
    // Run the mutation
    runMutation(
      removeSectionItemMutation,
      {
        variables: {
          externalId: externalId,
        },
      },
      `Item removed successfully.`,
      undefined,
      undefined,
      refetch,
    );
  };

  const [disableEnableSectionMutation] = useDisableEnableSectionMutation();
  const toggleEnableDisableSectionSwitch = (section: Section): void => {
    // Determine the new state
    const newDisabledState = !section.disabled;
    // Run the mutation
    console.log('section: ', section);
    runMutation(
      disableEnableSectionMutation,
      {
        variables: {
          data: {
            externalId: section.externalId,
            disabled: newDisabledState,
          },
        },
      },
      // display appropriate message based on disabledState
      newDisabledState
        ? 'Section disabled successfully.'
        : 'Section enabled successfully.',
      undefined,
      undefined,
      refetch,
    );
  };
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
                <Box
                  key={section.externalId}
                  display="flex"
                  alignItems="center"
                  p={2}
                >
                  {/* Section Title */}
                  <h2 style={{ marginRight: '2rem' }}>{section.title}</h2>
                  <p>{section.active}</p>
                  {/* Enable/Disable Switch */}
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={!section.disabled}
                          onChange={() =>
                            toggleEnableDisableSectionSwitch(section)
                          }
                        />
                      }
                      label={section.disabled ? 'Enable' : 'Disable'}
                      labelPlacement="end" // Places label next to switch
                    />
                  </FormGroup>
                </Box>
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
                            onEdit={() => {
                              // set the current section item being worked on to pass
                              // back to the parent component
                              setCurrentSectionItem(item);
                              toggleEditModal();
                            }}
                            onRemove={() => {
                              setCurrentSectionItem(item);
                              removeSectionItem(item.externalId);
                            }}
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
