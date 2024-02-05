import React, { useState } from 'react';
import { CardMedia, Typography } from '@mui/material';
import { Box, Stack, SxProps } from '@mui/system';

import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import BookmarksOutlinedIcon from '@mui/icons-material/BookmarksOutlined';

import { curationPalette } from '../../../theme';
import { ApprovedCorpusItem } from '../../../api/generatedTypes';
import { getDisplayTopic } from '../../../curated-corpus/helpers/topics';
import {
  getFormattedImageUrl,
  getLastScheduledDayDiff,
} from '../../../curated-corpus/helpers/helperFunctions';

interface CorpusItemCardImageProps {
  /**
   * An object with everything approved curated item-related in it.
   */
  item: ApprovedCorpusItem;

  /**
   * Current date that the schedule is being viewed for
   */
  currentScheduledDate: string;

  /**
   * Callback to toggle on and off recent scheduled modal
   */
  toggleScheduleHistoryModal: VoidFunction;
}

// Mui sx css for the individual label overlay container elements
const labelContainerSxStyles: SxProps = {
  display: 'flex',
  color: curationPalette.white,
  backgroundColor: curationPalette.overlayBgBlack,
  paddingTop: '0.1rem',
  paddingBottom: '0.1rem',
  paddingRight: '0.2rem',
  paddingLeft: '0.2rem',
  margin: '0.1rem',
  borderRadius: '8px',
  gap: 1,
  alignItems: 'center',
  justifyContent: 'space-around',
};

const topOverlayContainerSxStyles: SxProps = {
  position: 'absolute',
  top: 0,
  width: '100%',
};

const bottomOverlayContainerSxStyles: SxProps = {
  position: 'absolute',
  bottom: 0,
  width: '100%',
  cursor: 'pointer',
};

const getTopRightLabel = (item: ApprovedCorpusItem): JSX.Element | null => {
  //TODO @Herraj replace the string value being asserted on once MC-550 is complete
  if (item.createdBy === 'ML') {
    return (
      <>
        <AutoFixHighOutlinedIcon fontSize="small" />
        <Typography variant="caption">ML</Typography>
      </>
    );
  }

  if (item.isSyndicated) {
    return (
      <>
        <PaidOutlinedIcon fontSize="small" />
        <Typography variant="caption">Syndicated</Typography>
      </>
    );
  }

  if (item.isCollection) {
    return (
      <>
        <BookmarksOutlinedIcon fontSize="small" />
        <Typography variant="caption">Collection</Typography>
      </>
    );
  }

  return null;
};

const getBottomLeftLabel = (lastScheduledDayDiff: number): JSX.Element => {
  return (
    <Box
      sx={{
        ...labelContainerSxStyles,
        backgroundColor:
          lastScheduledDayDiff === 2
            ? curationPalette.solidPink
            : curationPalette.overlayBgBlack,
      }}
      data-testid="last-scheduled-overlay"
    >
      <EventAvailableOutlinedIcon fontSize="small" />
      <Typography variant="caption">
        {`Last scheduled ${lastScheduledDayDiff} days ago`}
      </Typography>
    </Box>
  );
};

/**
 * This component combines the MUI CardMedia and other MUI components to build
 * a custom component with a card image with some overlay labels
 * @param props
 * @returns A component that returns an image with the relevant overlay labels
 */
export const CorpusItemCardImage: React.FC<CorpusItemCardImageProps> = (
  props
): JSX.Element => {
  const { item, toggleScheduleHistoryModal, currentScheduledDate } = props;

  const [currentDateViewingScheduleFor] =
    useState<string>(currentScheduledDate);

  const displayTopic = getDisplayTopic(item.topic);

  const topRightLabel = getTopRightLabel(item);

  // extract the scheduled history dates into an string array
  const scheduledHistoryDates = item.scheduledSurfaceHistory.map(
    (scheduledHistory) => scheduledHistory.scheduledDate
  );

  const lastScheduledDayDiff = getLastScheduledDayDiff(
    currentDateViewingScheduleFor,
    scheduledHistoryDates
  );

  return (
    <Box position="relative">
      <CardMedia
        component="img"
        src={getFormattedImageUrl(item.imageUrl)}
        alt={item.title}
      />

      <Box sx={topOverlayContainerSxStyles}>
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          ml="0.1rem"
          mr="0.1rem"
        >
          <Box sx={labelContainerSxStyles}>
            <Typography variant="caption">{displayTopic}</Typography>
          </Box>

          {topRightLabel && (
            <Box sx={{ ...labelContainerSxStyles, right: '0.1rem' }}>
              {topRightLabel}
            </Box>
          )}
        </Stack>

        <Stack
          direction="column"
          alignItems="flex-start"
          justifyContent="space-between"
          ml="0.1rem"
        >
          {item.isTimeSensitive && (
            <Box
              sx={{
                ...labelContainerSxStyles,
                backgroundColor: curationPalette.translucentPink,
              }}
            >
              <Typography variant="caption">Time Sensitive</Typography>
            </Box>
          )}
        </Stack>
      </Box>

      <Box
        sx={bottomOverlayContainerSxStyles}
        onClick={toggleScheduleHistoryModal}
      >
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          ml="0.1rem"
          mb="0.1rem"
        >
          {lastScheduledDayDiff && getBottomLeftLabel(lastScheduledDayDiff)}
        </Stack>
      </Box>
    </Box>
  );
};
