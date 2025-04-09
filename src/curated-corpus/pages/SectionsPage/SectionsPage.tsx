import React, { useEffect, useState } from 'react';
import {
  ActionScreen,
  Section,
  SectionItem,
  useGetScheduledSurfacesForUserQuery,
  useGetSectionsWithSectionItemsLazyQuery,
} from '../../../api/generatedTypes';
import { DropdownOption } from '../../helpers/definitions';
import { Box, Grid } from '@mui/material';
import { HandleApiResponse } from '../../../_shared/components';
import {
  EditCorpusItemAction,
  RejectCorpusItemAction,
  SectionDetails,
  SplitButton,
} from '../../components';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useToggle } from '../../../_shared/hooks';
import { RemoveSectionItemAction } from '../../components/actions/RemoveSectionItemAction/RemoveSectionItemAction';

export const SectionsPage: React.FC = (): JSX.Element => {
  // set up the initial scheduled surface guid value (nothing at this point)
  const [currentScheduledSurfaceGuid, setCurrentScheduledSurfaceGuid] =
    useState('');

  // Set up the options we'll feed to the Scheduled Surface dropdown
  const [scheduledSurfaceOptions, setScheduledSurfaceOptions] = useState<
    DropdownOption[]
  >([]);

  const [currentSection, setCurrentSection] = useState('');

  /**
   * Set the current SectionItem to be worked on.
   */
  const [currentSectionItem, setCurrentSectionItem] = useState<
    Omit<SectionItem, '__typename'> | undefined
  >(undefined);

  /**
   * Keep track of whether the "Edit item modal" is open or not
   */
  const [editItemModalOpen, toggleEditModal] = useToggle(false);

  /**
   * Keep track of whether the "Reject item modal" is open or not
   */
  const [rejectItemModalOpen, toggleRejectModal] = useToggle(false);

  /**
   * Keep track of whether the "Remove section item modal" is open or not
   */
  const [removeSectionItemModalOpen, toggleRemoveSectionItemModal] =
    useToggle(false);

  // Get a list of sections on the page
  const [
    callGetSectionsWithSectionItemsQuery,
    {
      // error commented out for now, enabled when enabling notifications
      // error,
      data,
      refetch,
    },
  ] = useGetSectionsWithSectionItemsLazyQuery({
    // Do not cache sections. On update, remove the relevant section item
    // cards from the screen manually once the sections have been checked by curators.
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    variables: {
      scheduledSurfaceGuid: currentScheduledSurfaceGuid,
    },
  });

  // Get the list of Scheduled Surfaces the currently logged-in user has access to.
  const {
    data: scheduledSurfaceData,
    loading: scheduledSurfaceLoading,
    error: scheduledSurfaceError,
  } = useGetScheduledSurfacesForUserQuery({
    onCompleted: (data) => {
      const options = data.getScheduledSurfacesForUser.map(
        (scheduledSurface) => {
          return { code: scheduledSurface.guid, name: scheduledSurface.name };
        },
      );
      if (options.length > 0) {
        setCurrentScheduledSurfaceGuid(options[0].code);
        setScheduledSurfaceOptions(options);
      }
      // Call the dependent queries now
      callGetSectionsWithSectionItemsQuery();
    },
  });

  /**
   * When the user selects another Scheduled Surface from the
   * dropdown, refetch all the data on the page for that surface.
   */
  const updateScheduledSurface = (option: DropdownOption) => {
    // Fetch sections for the selected Scheduled Surface
    refetch && refetch({ scheduledSurfaceGuid: option.code });

    // Update the split button to reflect which ScheduledSurface the user is now on.
    setCurrentScheduledSurfaceGuid(option.code);
  };

  /**
   * When the user selects a section from the section Dropdown, set that current section.
   */
  const updateSection = (option: DropdownOption) => {
    setCurrentSection(option.code);
  };

  // Storing the sections here which will be shown in the UI.
  const [sections, setSections] = useState<Section[]>([]);

  // Section options stored as a Dropdown object
  const [sectionOptions, setSectionOptions] = useState<DropdownOption[]>([]);

  // UseEffect hook that gets the sections for the selected scheduled surface
  // has the section data & currentScheduledSurfaceGuid as the dependency and initial execution is also on page load
  useEffect(() => {
    if (currentScheduledSurfaceGuid && data) {
      const fetchedSections = data.getSectionsWithSectionItems;
      // Sort sections in alphabetical order by title
      fetchedSections.sort((a, b) => a.title.localeCompare(b.title));
      setSections(fetchedSections);

      const sectionTitlesArr: string[] = fetchedSections.map(
        (section) => section.title,
      );

      // Add "All Sections" option as default
      const options = [
        { code: 'all', name: 'All Sections' },
        ...sectionTitlesArr.map((title) => ({ code: title, name: title })),
      ];

      setSectionOptions(options);
      setCurrentSection('all'); // Set default to "All Sections"
    }
  }, [data, currentScheduledSurfaceGuid]);

  return (
    <>
      <h1>Sections</h1>
      {currentSectionItem?.approvedItem && (
        <>
          <EditCorpusItemAction
            item={currentSectionItem.approvedItem}
            actionScreen={ActionScreen.Sections}
            modalOpen={editItemModalOpen}
            toggleModal={toggleEditModal}
            refetch={refetch}
          />
          <RejectCorpusItemAction
            item={currentSectionItem.approvedItem}
            actionScreen={ActionScreen.Sections}
            modalOpen={rejectItemModalOpen}
            toggleModal={toggleRejectModal}
            refetch={refetch}
          />
          <RemoveSectionItemAction
            sectionItem={currentSectionItem}
            modalOpen={removeSectionItemModalOpen}
            toggleModal={toggleRemoveSectionItemModal}
            refetch={refetch}
          />
        </>
      )}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={8}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              {!scheduledSurfaceData && (
                <HandleApiResponse
                  loading={scheduledSurfaceLoading}
                  error={scheduledSurfaceError}
                />
              )}
              {scheduledSurfaceOptions.length > 0 && (
                <>
                  Sections for
                  <SplitButton
                    onMenuOptionClick={updateScheduledSurface}
                    options={scheduledSurfaceOptions}
                    size="small"
                  />
                </>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box display="flex" justifyContent="flex-end" mb={2}>
                {sectionOptions.length > 0 && (
                  <SplitButton
                    icon={<FilterListIcon fontSize="large" />}
                    onMenuOptionClick={updateSection}
                    options={sectionOptions}
                    size="medium"
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <SectionDetails
        sections={sections}
        currentSection={currentSection}
        setCurrentSectionItem={setCurrentSectionItem}
        currentScheduledSurfaceGuid={currentScheduledSurfaceGuid}
        toggleEditModal={toggleEditModal}
        toggleRejectModal={toggleRejectModal}
        toggleRemoveSectionItemModal={toggleRemoveSectionItemModal}
        refetch={refetch}
      />
    </>
  );
};
