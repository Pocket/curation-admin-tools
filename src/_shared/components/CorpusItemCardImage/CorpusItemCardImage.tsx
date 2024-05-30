import React, { ReactElement, useState } from 'react';
import { CardMedia, Typography } from '@mui/material';
import { Box, Stack, SxProps } from '@mui/system';

import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
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
   * If this Scheduled item was scheduled by ML
   */
  isMlScheduled: boolean;

  /**
   * Current date that the schedule is being viewed for
   */
  currentScheduledDate: string;

  /**
   * The surface the card is displayed on, e.g. EN_US
   */
  scheduledSurfaceGuid: string;

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
};

const getTopRightLabel = (
  item: ApprovedCorpusItem,
  isMlScheduled: boolean
): ReactElement | null => {
  if (isMlScheduled) {
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

const getBottomLeftLastScheduledLabel = (
  lastScheduledDayDiff: number,
  toggleScheduleHistoryModal: VoidFunction,
  highlightLastScheduled?: boolean
): ReactElement => {
  return (
    <Box
      sx={{
        ...labelContainerSxStyles,
        cursor: 'pointer',
        backgroundColor: highlightLastScheduled
          ? curationPalette.solidPink
          : curationPalette.overlayBgBlack,
      }}
      data-testid="last-scheduled-overlay"
      onClick={toggleScheduleHistoryModal}
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
): ReactElement => {
  const {
    item,
    isMlScheduled,
    toggleScheduleHistoryModal,
    currentScheduledDate,
    scheduledSurfaceGuid,
  } = props;

  const [currentDateViewingScheduleFor] =
    useState<string>(currentScheduledDate);

  const displayTopic = getDisplayTopic(item.topic);

  const topRightLabel = getTopRightLabel(item, isMlScheduled);

  // extract the scheduled history dates into a string array
  const scheduledHistoryDates = item.scheduledSurfaceHistory.map(
    (scheduledHistory) => scheduledHistory.scheduledDate
  );

  const lastScheduledDayDiff = getLastScheduledDayDiff(
    currentDateViewingScheduleFor,
    scheduledHistoryDates
  );

  // Find the most recent date this item was scheduled on this surface
  const datesForCurrentSurface = item.scheduledSurfaceHistory
    .filter((history) => history.scheduledSurfaceGuid == scheduledSurfaceGuid)
    .map((history) => history.scheduledDate);

  const lastScheduledOnThisSurface = getLastScheduledDayDiff(
    currentDateViewingScheduleFor,
    datesForCurrentSurface
  );

  // Determine whether to highlight the "Last scheduled X days ago" overlay
  const highlightLastScheduled = !!(
    lastScheduledOnThisSurface &&
    // for syndicated items or collections, only highlight items scheduled
    // up to two days ago on the same surface
    (((item.isSyndicated || item.isCollection) &&
      lastScheduledOnThisSurface <= 2) ||
      // for all other items, always highlight if they were previously
      // EVER scheduled on the same surface
      (!item.isSyndicated && !item.isCollection))
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
          component="div"
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
          component="div"
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

      <Box sx={bottomOverlayContainerSxStyles}>
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          ml="0.1rem"
          mb="0.1rem"
          component="div"
        >
          {lastScheduledDayDiff &&
            getBottomLeftLastScheduledLabel(
              lastScheduledDayDiff,
              toggleScheduleHistoryModal,
              highlightLastScheduled
            )}
        </Stack>

        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
          component="div"
          ml="0.1rem"
          mb="0.1rem"
        >
          {!item.hasTrustedDomain && (
            <Box
              sx={{
                ...labelContainerSxStyles,
                backgroundColor: curationPalette.solidPink,
                textTransform: 'uppercase',
              }}
            >
              <WarningAmberIcon fontSize="small" />
              <Typography variant="caption">New domain</Typography>
            </Box>
          )}
        </Stack>
      </Box>
    </Box>
  );
};
