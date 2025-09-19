import React from 'react';
import { DateTime } from 'luxon';
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
}

export const CustomSectionTable: React.FC<CustomSectionTableProps> = ({
  title,
  sections,
}): JSX.Element | null => {
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
            backgroundColor: '#F0F7FF',
            color: curationPalette.blue,
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
              <TableCell sx={{ width: '40%' }}>Title</TableCell>
              <TableCell sx={{ width: '20%' }}>Start</TableCell>
              <TableCell sx={{ width: '20%' }}>End</TableCell>
              <TableCell sx={{ width: '20%' }}>Status</TableCell>
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
