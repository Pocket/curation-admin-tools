import React from 'react';
import { Fab } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

interface FloatingActionButtonProps {
  /**
   * Callback function for this button
   */
  onClick: VoidFunction;
}

/**
 * This is a wrapper component around the Mui FAB component. Right now it doesn't have a lot of props
 * to customize this, but it could be expanded upon in the future if need be e.g (Icon/Style)
 */
export const FloatingActionButton: React.FC<FloatingActionButtonProps> = (
  props
): JSX.Element => {
  const { onClick } = props;

  return (
    <Fab
      color="default"
      size="medium"
      onClick={onClick}
      sx={{
        position: 'fixed',
        margin: '0rem',
        top: 'auto',
        right: '1.5rem',
        bottom: '1.5rem',
        left: 'auto',
      }}
    >
      <ArrowUpwardIcon />
    </Fab>
  );
};
