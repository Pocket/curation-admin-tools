import React from 'react';
import { CardMedia, Typography } from '@mui/material';
import { Box, Stack, SxProps } from '@mui/system';

import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import BookmarksOutlinedIcon from '@mui/icons-material/BookmarksOutlined';

import { curationPalette } from '../../../theme';
import { ApprovedCorpusItem } from '../../../api/generatedTypes';
import { getDisplayTopic } from '../../../curated-corpus/helpers/topics';
import { getFormattedImageUrl } from '../../../curated-corpus/helpers/helperFunctions';

interface CorpusItemCardImageProps {
  /**
   * An object with everything approved curated item-related in it.
   */
  item: ApprovedCorpusItem;

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
  padding: '0.2rem',
  margin: '0.1rem',
  borderRadius: '8px',
  gap: 1,
  alignItems: 'center',
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

const getLastScheduledDayDiff = (item: ApprovedCorpusItem): number | null => {
  const currentDate = new Date();
  const mostRecentLastScheduledDate = item.scheduledSurfaceHistory.find(
    (history) => new Date(history.scheduledDate) < currentDate
  );

  if (!mostRecentLastScheduledDate) {
    return null;
  }

  //TODO @Herraj -- date is sometimes off by one day, probably have to standardize the TZ

  const timeDifference =
    currentDate.getTime() -
    new Date(mostRecentLastScheduledDate.scheduledDate).getTime();
  return Math.abs(Math.ceil(timeDifference / (1000 * 3600 * 24)));
};

const getTopRightLabel = (item: ApprovedCorpusItem): JSX.Element | null => {
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
        <PaidOutlinedIcon fontSize="small" sx={{ color: '#A8FF1A' }} />
        <Typography variant="caption">Syndicated</Typography>
      </>
    );
  }

  if (item.isCollection) {
    return (
      <>
        <BookmarksOutlinedIcon fontSize="small" sx={{ color: '#FFB800' }} />
        <Typography variant="caption">Collection</Typography>
      </>
    );
  }

  return null;
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
  const { item, toggleScheduleHistoryModal } = props;

  const displayTopic = getDisplayTopic(item.topic);

  const topRightLabel = getTopRightLabel(item);

  const lastScheduledDayDiff = getLastScheduledDayDiff(item);

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
        >
          <Box sx={labelContainerSxStyles}>
            <Typography variant="caption">{displayTopic}</Typography>
          </Box>

          {topRightLabel && (
            <Box sx={labelContainerSxStyles}>{topRightLabel}</Box>
          )}
        </Stack>

        <Stack
          direction="column"
          alignItems="flex-start"
          justifyContent="space-between"
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
        >
          {lastScheduledDayDiff && (
            <Box
              sx={{
                ...labelContainerSxStyles,
                backgroundColor:
                  lastScheduledDayDiff === 2
                    ? curationPalette.solidPink
                    : curationPalette.overlayBgBlack,
              }}
            >
              <EventAvailableOutlinedIcon fontSize="small" />
              <Typography variant="caption">
                {`Last scheduled ${lastScheduledDayDiff} days ago`}
              </Typography>
            </Box>
          )}
        </Stack>
      </Box>
    </Box>
  );
};
