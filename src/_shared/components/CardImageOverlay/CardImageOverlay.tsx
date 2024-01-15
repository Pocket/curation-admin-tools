import React from 'react';
import { Typography } from '@mui/material';
import { Box, Stack, SxProps } from '@mui/system';

import { curationPalette } from '../../../theme';
import { ApprovedCorpusItem } from '../../../api/generatedTypes';
import { getDisplayTopic } from '../../../curated-corpus/helpers/topics';

interface CardImageOverlayProps {
  /**
   * An object with everything approved curated item-related in it.
   */
  item: ApprovedCorpusItem;
}

// Mui sx css for the root Box container
const rootSxStyles: SxProps = {
  position: 'absolute',
  top: 0,
  width: '100%',
};

// Mui sx css for the overlay text background
const getLabelSxStyles = (item: ApprovedCorpusItem): SxProps => {
  return {
    color: curationPalette.white,
    backgroundColor: item.isTimeSensitive
      ? 'rgb(197, 0, 66, 0.7)'
      : 'rgba(0, 0, 0, 0.7)',
    padding: '0.2rem',
    margin: '0.1rem',
  };
};

/**
 * Takes in an ApprovedCorpusItem type
 * @param props
 * @returns A card image overlay component meant to be used in our custom card components.
 * Needs to be added after CardMedia and before CardContent MUI components used in our custom card components.
 */
export const CardImageOverlay: React.FC<CardImageOverlayProps> = (
  props
): JSX.Element => {
  const { item } = props;

  const displayTopic = getDisplayTopic(item.topic);

  const labelSxStyles = getLabelSxStyles(item);

  return (
    <Box sx={rootSxStyles}>
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
      >
        <Box sx={labelSxStyles}>
          <Typography variant="caption">{displayTopic}</Typography>
        </Box>
        {item.isSyndicated && (
          <Box sx={labelSxStyles}>
            <Typography variant="caption">Syndicated</Typography>
          </Box>
        )}
      </Stack>
      <Stack direction="row" alignItems="flex-start">
        {item.isTimeSensitive && (
          <Box sx={labelSxStyles}>
            <Typography variant="caption">Time Sensitive</Typography>
          </Box>
        )}
      </Stack>
    </Box>
  );
};
