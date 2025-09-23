import React, { useEffect, useState } from 'react';
import {
  ActivitySource,
  Section,
  SectionStatus,
  useGetScheduledSurfacesForUserQuery,
  useGetSectionsWithSectionItemsLazyQuery,
} from '../../../api/generatedTypes';
import { DropdownOption } from '../../helpers/definitions';
import { Box, Typography, Paper } from '@mui/material';
import { HandleApiResponse } from '../../../_shared/components';
import { SplitButton } from '../../components';
import { CustomSectionTable } from '../../components/CustomSectionTable/CustomSectionTable';
import { curationPalette } from '../../../theme';

interface GroupedSections {
  scheduled: Section[];
  live: Section[];
  expired: Section[];
}

export const CustomSectionsPage: React.FC = (): JSX.Element => {
  const [currentScheduledSurfaceGuid, setCurrentScheduledSurfaceGuid] =
    useState('');
  const [scheduledSurfaceOptions, setScheduledSurfaceOptions] = useState<
    DropdownOption[]
  >([]);
  const [groupedSections, setGroupedSections] = useState<GroupedSections>({
    scheduled: [],
    live: [],
    expired: [],
  });

  // Get sections with section items
  const [
    callGetSectionsWithSectionItemsQuery,
    { data, loading, error, refetch },
  ] = useGetSectionsWithSectionItemsLazyQuery({
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    variables: {
      scheduledSurfaceGuid: currentScheduledSurfaceGuid,
      createSource: ActivitySource.Manual,
    },
    onCompleted: () => {
      // Query completed
    },
  });

  // Get scheduled surfaces for user
  useGetScheduledSurfacesForUserQuery({
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
      callGetSectionsWithSectionItemsQuery();
    },
  });

  // Update scheduled surface
  const updateScheduledSurface = (option: DropdownOption) => {
    refetch &&
      refetch({
        scheduledSurfaceGuid: option.code,
        createSource: ActivitySource.Manual,
      });
    setCurrentScheduledSurfaceGuid(option.code);
  };

  // Group sections by status (server provides the status now)
  useEffect(() => {
    if (data?.getSectionsWithSectionItems) {
      const sections = data.getSectionsWithSectionItems;

      const grouped: GroupedSections = {
        scheduled: [],
        live: [],
        expired: [],
      };

      sections.forEach((section) => {
        const status = section.status as SectionStatus;

        if (status === SectionStatus.Live) {
          grouped.live.push(section);
        } else if (status === SectionStatus.Scheduled) {
          grouped.scheduled.push(section);
        } else if (
          status === SectionStatus.Expired ||
          status === SectionStatus.Disabled
        ) {
          grouped.expired.push(section);
        }
      });

      // Sort each group by start date (most recent first)
      Object.keys(grouped).forEach((key) => {
        grouped[key as keyof GroupedSections].sort((a, b) => {
          const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
          const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
          return dateB - dateA;
        });
      });

      setGroupedSections(grouped);
    }
  }, [data]);

  return (
    <>
      <Typography
        variant="h4"
        component="h1"
        sx={{
          color: curationPalette.pocketBlack,
          fontWeight: 500,
          lineHeight: '1.2125em',
          marginBottom: '0.5em',
          marginTop: '0.2em',
          textRendering: 'optimizeLegibility',
        }}
      >
        Custom Sections
      </Typography>

      {/* Toolbar: surface dropdown */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          marginBottom: '24px',
        }}
      >
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
      </Box>

      {/* Main Content */}
      <Box>
        {loading && <HandleApiResponse loading={loading} error={error} />}

        {!loading && data && (
          <>
            <CustomSectionTable
              title="Scheduled"
              sections={groupedSections.scheduled}
            />
            <CustomSectionTable title="Live" sections={groupedSections.live} />
            <CustomSectionTable
              title="Expired"
              sections={groupedSections.expired}
            />

            {Object.values(groupedSections).every(
              (group) => group.length === 0,
            ) && (
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  border: `1px solid ${curationPalette.lightGrey}`,
                }}
              >
                <Typography color="text.secondary">
                  No custom sections found for this surface
                </Typography>
              </Paper>
            )}
          </>
        )}
      </Box>
    </>
  );
};
