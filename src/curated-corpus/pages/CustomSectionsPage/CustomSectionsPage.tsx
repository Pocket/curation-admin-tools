import React, { useEffect, useMemo, useState } from 'react';
import {
  Section,
  ActivitySource,
  SectionStatus,
  useGetScheduledSurfacesForUserQuery,
  useGetSectionsWithSectionItemsLazyQuery,
} from '../../../api/generatedTypes';
import { DropdownOption } from '../../helpers/definitions';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Chip,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { HandleApiResponse } from '../../../_shared/components';
import { DateTime } from 'luxon';

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
  const [startDate, setStartDate] = useState<DateTime | null>(
    DateTime.local().startOf('month'),
  );
  const [endDate, setEndDate] = useState<DateTime | null>(
    DateTime.local().endOf('month'),
  );

  // Get sections with section items
  const [
    callGetSectionsWithSectionItemsQuery,
    { data, loading, error, refetch },
  ] = useGetSectionsWithSectionItemsLazyQuery({
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
    variables: {
      scheduledSurfaceGuid: currentScheduledSurfaceGuid,
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
    refetch && refetch({ scheduledSurfaceGuid: option.code });
    setCurrentScheduledSurfaceGuid(option.code);
  };

  // Group sections by status
  useEffect(() => {
    if (data?.getSectionsWithSectionItems) {
      const sections = data.getSectionsWithSectionItems;

      // Filter only MANUAL sections (custom sections)
      const customSections = sections.filter((section) => section.createSource === 'MANUAL');

      const grouped: GroupedSections = {
        scheduled: [],
        live: [],
        expired: [],
      };

      customSections.forEach((section) => {
        const status = section.status as SectionStatus | null;

        // Prefer server-computed status when present
        if (status === SectionStatus.Live) {
          grouped.live.push(section);
          return;
        }
        if (status === SectionStatus.Scheduled) {
          grouped.scheduled.push(section);
          return;
        }
        if (
          status === SectionStatus.Expired ||
          status === SectionStatus.Disabled
        ) {
          grouped.expired.push(section);
          return;
        }

        // Fallback inference when status is missing
        const now = new Date();
        const start = section.startDate ? new Date(section.startDate) : null;
        const end = section.endDate ? new Date(section.endDate) : null;
        const hasStarted = !!start && start <= now;
        const hasEnded = !!end && end < now;

        if (section.disabled || hasEnded) {
          grouped.expired.push(section);
          return;
        }

        // If start date is in the future, it's scheduled regardless of active status
        if (start && start > now) {
          grouped.scheduled.push(section);
          return;
        }

        // Treat active=true as Live (unless disabled/expired/future above)
        if (section.active) {
          grouped.live.push(section);
          return;
        }

        if (hasStarted) {
          grouped.live.push(section);
          return;
        }

        grouped.scheduled.push(section);
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

  const getStatusChip = (section: Section) => {
    const status = section.status as SectionStatus | null;

    if (status === SectionStatus.Disabled) {
      return (
        <Chip
          label="Disabled"
          size="small"
          sx={{ backgroundColor: '#F3F3F5', color: '#6B6B7B', fontWeight: 500 }}
        />
      );
    }

    if (status === SectionStatus.Expired) {
      return (
        <Chip
          label="Expired"
          size="small"
          sx={{ backgroundColor: '#FFF0F0', color: '#D32F2F', fontWeight: 500 }}
        />
      );
    }

    if (status === SectionStatus.Scheduled) {
      return (
        <Chip
          label="Scheduled"
          size="small"
          sx={{ backgroundColor: '#F3F3F5', color: '#6B6B7B', fontWeight: 500 }}
        />
      );
    }

    if (status === SectionStatus.Live) {
      return (
        <Chip
          label="Live"
          size="small"
          sx={{ backgroundColor: '#F0F7FF', color: '#1976D2', fontWeight: 500 }}
        />
      );
    }

    // Fallback
    return (
      <Chip
        label="Unknown"
        size="small"
        sx={{ backgroundColor: '#F3F3F5', color: '#6B6B7B', fontWeight: 500 }}
      />
    );
  };

  const renderSectionTable = (title: string, sections: Section[]) => {
    if (sections.length === 0) return null;

    return (
      <Box mb={4} sx={{ width: '100%', maxWidth: '100%' }}>
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ border: '1px solid #E0E0E6', overflowX: 'auto' }}
        >
          <Table sx={{ minWidth: 650, tableLayout: 'auto' }}>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Start</TableCell>
                <TableCell>End</TableCell>
                {/* <TableCell sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                  Updates
                </TableCell> */}
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sections.map((section) => (
                <TableRow key={section.externalId} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography>{section.title}</Typography>
                      {section.active && (
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: '#4CAF50',
                          }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Typography>
                      {section.startDate
                        ? DateTime.fromISO(section.startDate).toFormat(
                            'MMM dd, yyyy',
                          )
                        : '-'}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Typography>
                      {section.endDate
                        ? DateTime.fromISO(section.endDate).toFormat(
                            'MMM dd, yyyy',
                          )
                        : '-'}
                    </Typography>
                  </TableCell>
                  {/* <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
                      {section.sectionItems?.length
                        ? `${section.sectionItems.length === 1 ? 'Daily' : section.sectionItems.length > 7 ? 'Monthly' : 'Weekly'}`
                        : 'Manual'}
                    </Typography>
                  </TableCell> */}
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {getStatusChip(section)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  return (
    <>
      {/* Toolbar: surface dropdown only */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          marginBottom: '24px',
          flexWrap: 'wrap',
          width: '100%',
        }}
      >
        {scheduledSurfaceOptions.length > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Surface:
            </Typography>
            <TextField
              select
              size="small"
              value={currentScheduledSurfaceGuid}
              onChange={(e) => {
                const option = scheduledSurfaceOptions.find(
                  (opt) => opt.code === e.target.value,
                );
                if (option) updateScheduledSurface(option);
              }}
              sx={{ minWidth: 200 }}
            >
              {scheduledSurfaceOptions.map((option) => (
                <MenuItem key={option.code} value={option.code}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        )}

        {/* Date filtering and action buttons - commented out for now */}
        {/* <LocalizationProvider dateAdapter={AdapterLuxon}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Start date
            </Typography>
            <DatePicker
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  sx={{ width: { xs: 120, sm: 140 } }}
                />
              )}
              components={{
                OpenPickerIcon: CalendarTodayIcon,
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              End date
            </Typography>
            <DatePicker
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  sx={{ width: { xs: 120, sm: 140 } }}
                />
              )}
              components={{
                OpenPickerIcon: CalendarTodayIcon,
              }}
            />
          </Box>
        </LocalizationProvider>

        <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
          <Button
            variant="contained"
            size="medium"
            sx={{
              backgroundColor: '#5B2EDF',
              textTransform: 'none',
              fontWeight: 600,
              padding: '4px 14px',
              borderRadius: '20px',
              minHeight: 32,
              '&:hover': {
                backgroundColor: '#4A24B3',
              },
            }}
            onClick={() => {
              if (refetch) {
                refetch({ scheduledSurfaceGuid: currentScheduledSurfaceGuid });
              } else {
                callGetSectionsWithSectionItemsQuery({
                  variables: {
                    scheduledSurfaceGuid: currentScheduledSurfaceGuid,
                  },
                });
              }
            }}
          >
            Get Sections
          </Button>
          <Button
            variant="contained"
            size="medium"
            sx={{
              backgroundColor: '#5B2EDF',
              textTransform: 'none',
              fontWeight: 600,
              padding: '4px 14px',
              borderRadius: '20px',
              minHeight: 32,
              '&:hover': {
                backgroundColor: '#4A24B3',
              },
            }}
          >
            New Section
          </Button>
        </Box> */}
      </Box>

      {/* Main Content */}
      <Box>
        {loading && <HandleApiResponse loading={loading} error={error} />}

        {!loading && data && (
          <>
            {renderSectionTable('Scheduled', groupedSections.scheduled)}
            {renderSectionTable('Live', groupedSections.live)}
            {renderSectionTable('Expired', groupedSections.expired)}

            {Object.values(groupedSections).every(
              (group) => group.length === 0,
            ) && (
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  border: '1px solid #E0E0E6',
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
