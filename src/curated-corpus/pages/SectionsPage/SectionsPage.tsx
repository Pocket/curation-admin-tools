import React, { useEffect, useState } from 'react';
import {
  Section,
  useGetScheduledSurfacesForUserQuery,
  useGetSectionsWithSectionItemsLazyQuery,
} from '../../../api/generatedTypes';
import { DropdownOption } from '../../helpers/definitions';
import { Box, Grid } from '@mui/material';
import { HandleApiResponse } from '../../../_shared/components';
import { SplitButton } from '../../components';
import FilterListIcon from '@mui/icons-material/FilterList';

export const SectionsPage: React.FC = (): JSX.Element => {
  // set up the initial scheduled surface guid value (nothing at this point)
  const [currentScheduledSurfaceGuid, setCurrentScheduledSurfaceGuid] =
    useState('');

  // Set up the options we'll feed to the Scheduled Surface dropdown
  const [scheduledSurfaceOptions, setScheduledSurfaceOptions] = useState<
    DropdownOption[]
  >([]);

  // state variable to toggle on or off the empty state component
  // if the callGetSectionsWithSectionItemsQuery query returns no data and no errors, this will be set to true
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [showEmptyState, setShowEmptyState] = useState<boolean>(false);
  const [currentSection, setCurrentSection] = useState('');
  // Get a list of sections on the page
  const [callGetSectionsWithSectionItemsQuery, { error, data, refetch }] =
    useGetSectionsWithSectionItemsLazyQuery({
      // Do not cache sections. On update, remove the relevant section item
      // cards from the screen manually once the sections have been checked by curators.
      fetchPolicy: 'no-cache',
      notifyOnNetworkStatusChange: true,
      variables: {
        scheduledSurfaceGuid: currentScheduledSurfaceGuid,
      },
      onCompleted: (data) => {
        if (!data && !error) {
          setShowEmptyState(true);
        }
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
      // call the dependent queries now
      callGetSectionsWithSectionItemsQuery();
    },
  });

  /**
   * When the user selects another Scheduled Surface from the
   * dropdown, refetch all the data on the page for that surface.
   */
  const updateScheduledSurface = (option: DropdownOption) => {
    // fetch sections for the selected Scheduled Surface
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
  // Section titles to be displayed in the Dropdown
  const [sectionTitles, setSectionTitles] = useState<string[]>([]);
  // Section options stored as a Dropdown object
  const [sectionOptions, setSectionOptions] = useState<DropdownOption[]>([]);

  // UseEffect hook that gets the sections for the selected scheduled surface
  // has the section data & currentScheduledSurfaceGuid as the dependency and initial execution is also on page load
  useEffect(() => {
    if (currentScheduledSurfaceGuid && data) {
      const fetchedSections = data.getSectionsWithSectionItems;
      setSections(fetchedSections);

      const sectionTitlesArr: string[] = fetchedSections.map(
        (section) => section.title,
      );
      setSectionTitles(sectionTitlesArr);

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
                {sectionTitles.length > 0 && (
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
          {sections &&
            sections
              .filter(
                (section) =>
                  currentSection === 'all' || section.title === currentSection,
              )
              .map((section) => (
                <Box
                  key={section.externalId}
                  mt={2}
                  p={2}
                  border={1}
                  borderColor="grey.300"
                >
                  <h2>{section.title}</h2>
                  <p>{section.active}</p>
                </Box>
              ))}
        </Grid>
      </Grid>
    </>
  );
};
