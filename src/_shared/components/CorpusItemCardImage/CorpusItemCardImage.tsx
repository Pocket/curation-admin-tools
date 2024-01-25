import React from 'react';
import { CardMedia, Typography } from '@mui/material';
import { Box, Stack, SxProps } from '@mui/system';

//TODO @Herraj -- uncomment this when ready to render 'ML' label overlay and new schedule history modal
// import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
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

  toggleScheduleHistoryModal: VoidFunction;
}

// Mui sx css for the individual label overlay container elements
const labelContainerSxStyles: SxProps = {
  display: 'flex',
  color: curationPalette.white,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
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

//TODO @Herraj -- read comment on line 100
// const bottomOverlayContainerSxStyles: SxProps = {
//   position: 'absolute',
//   bottom: 0,
//   width: '100%',
// };

/**
 * This component combines the MUI CardMedia and other MUI components to build
 * a custom component with a card image with some overlay labels
 * @param props
 * @returns A component that returns an image with the relevant overlay labels
 */
export const CorpusItemCardImage: React.FC<CorpusItemCardImageProps> = (
  props
): JSX.Element => {
  const { item } = props;

  const displayTopic = getDisplayTopic(item.topic);

  const getTopRightLabel = () => {
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
  };

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

          <Box sx={labelContainerSxStyles}>{getTopRightLabel()}</Box>
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

      {/**TODO @Herraj -- enable once new schedule history modal component is complete */}
      {/* <Box sx={bottomOverlayContainerSxStyles}>
        <Stack
          direction="row"
          alignItems="flex-start"
          justifyContent="space-between"
        >
          <Box
            sx={{
              ...labelContainerSxStyles,
              backgroundColor: curationPalette.solidPink,
            }}
          >
            <EventAvailableOutlinedIcon fontSize="small" />
            <button onClick={toggleScheduleHistoryModal}></button>
            <Typography variant="caption">Last Scheduled 2 days ago</Typography>
          </Box>
        </Stack>
      </Box> */}
    </Box>
  );
};
