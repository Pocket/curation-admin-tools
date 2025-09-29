import React from 'react';
import { DateTime } from 'luxon';
import { useHistory } from 'react-router-dom';
import { Section, SectionStatus } from '../../../api/generatedTypes';
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
} from '@mui/material';
import { curationPalette } from '../../../theme';

interface CustomSectionTableProps {
  title: string;
  sections: Section[];
  scheduledSurfaceGuid?: string;
}

export const CustomSectionTable: React.FC<CustomSectionTableProps> = ({
  title,
  sections,
  scheduledSurfaceGuid,
}): JSX.Element | null => {
  const history = useHistory();
  if (sections.length === 0) return null;

  const getStatusChip = (section: Section) => {
    const status = section.status as SectionStatus;

    if (status === SectionStatus.Disabled) {
      return (
        <Chip
          label="Disabled"
          size="small"
          sx={{
            backgroundColor: curationPalette.lightGrey,
            color: curationPalette.regularGrey,
            fontWeight: 500,
          }}
        />
      );
    }

    if (status === SectionStatus.Expired) {
      return (
        <Chip
          label="Expired"
          size="small"
          sx={{
            backgroundColor: '#FFF0F0',
            color: curationPalette.secondary,
            fontWeight: 500,
          }}
        />
      );
    }

    if (status === SectionStatus.Scheduled) {
      return (
        <Chip
          label="Scheduled"
          size="small"
          sx={{
            backgroundColor: curationPalette.lightGrey,
            color: curationPalette.regularGrey,
            fontWeight: 500,
          }}
        />
      );
    }

    if (status === SectionStatus.Live) {
      return (
        <Chip
          label="Live"
          size="small"
          sx={{
            backgroundColor: curationPalette.lightGreen,
            color: curationPalette.primary,
            fontWeight: 500,
          }}
        />
      );
    }

    return (
      <Chip
        label="Unknown"
        size="small"
        sx={{
          backgroundColor: curationPalette.lightGrey,
          color: curationPalette.regularGrey,
          fontWeight: 500,
        }}
      />
    );
  };

  return (
    <Box mb={4} sx={{ width: '100%', maxWidth: '100%' }}>
      <Typography
        variant="h5"
        sx={{
          color: curationPalette.pocketBlack,
          fontWeight: 500,
          lineHeight: '1.2125em',
          marginBottom: '0.5em',
          marginTop: '0.2em',
          textRendering: 'optimizeLegibility',
        }}
      >
        {title}
      </Typography>
      {title === 'Live' && (
        <Typography
          variant="body2"
          sx={{
            color: curationPalette.secondary,
            marginBottom: '0.5em',
            fontStyle: 'italic',
          }}
        >
          * Sections without items will not be displayed on New Tab
        </Typography>
      )}
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{
          border: `1px solid ${curationPalette.lightGrey}`,
          overflowX: 'auto',
        }}
      >
        <Table sx={{ minWidth: 650, tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '30%' }}>Title</TableCell>
              <TableCell sx={{ width: '15%' }}>Start</TableCell>
              <TableCell sx={{ width: '15%' }}>End</TableCell>
              <TableCell sx={{ width: '15%' }}>Items</TableCell>
              <TableCell sx={{ width: '25%' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sections.map((section) => (
              <TableRow
                key={section.externalId}
                hover
                onClick={() => {
                  if (scheduledSurfaceGuid) {
                    history.push(
                      `/curated-corpus/custom-sections/${section.externalId}/${scheduledSurfaceGuid}/`,
                    );
                  }
                }}
                sx={{ cursor: scheduledSurfaceGuid ? 'pointer' : 'default' }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>{section.title}</Typography>
                    {section.status === SectionStatus.Live && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: curationPalette.primary,
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
                <TableCell>
                  <Typography
                    sx={{
                      color:
                        section.sectionItems?.length === 0
                          ? curationPalette.secondary
                          : 'inherit',
                      fontWeight:
                        section.sectionItems?.length === 0 ? 500 : 'normal',
                    }}
                  >
                    {section.sectionItems?.length === 0
                      ? 'No items'
                      : `${section.sectionItems?.length || 0} ${section.sectionItems?.length === 1 ? 'item' : 'items'}`}
                  </Typography>
                </TableCell>
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
