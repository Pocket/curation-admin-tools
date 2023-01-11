import React from 'react';
import { Chip as MuiChip, ChipProps } from '@mui/material';
import { curationPalette } from '../../../theme';

/**
 * A custom Chip component that shows a number in a pill-like element.
 */
export const Chip: React.FC<ChipProps> = (props): JSX.Element => {
  const { label, color } = props;

  return (
    <MuiChip
      label={label}
      size="small"
      color={color}
      sx={{
        // For reasons unknown, a styled chip doesn't get styles applied
        // when used deep within MUI components, e.g. Tab -> TabLink -> Chip.
        // So inline styles it is.
        color: curationPalette.white,
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 400,
        marginLeft: '0.5rem',
      }}
    />
  );
};
