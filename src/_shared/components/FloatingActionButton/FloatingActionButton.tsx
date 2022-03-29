import React from 'react';
import { Fab, IconButton } from '@material-ui/core';
import { ArrowUpward } from '@material-ui/icons';

/**
 * This is a wrapper component around the Mui FAB component. Right now it doesn't have a lot of props
 * to customize this but it could be expanded upon in the future if need be e.g (Icon/Style)
 */

interface FloatingActionButtonProps {
  /**
   * Callback function for this button
   */
  onClick: VoidFunction;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = (
  props
): JSX.Element => {
  const { onClick } = props;

  return (
    <Fab
      color="default"
      size="medium"
      style={{
        margin: 0,
        top: 'auto',
        right: 50,
        bottom: 20,
        left: 'auto',
        position: 'fixed',
      }}
    >
      <IconButton title="Scroll to top" onClick={onClick}>
        <ArrowUpward />
      </IconButton>
    </Fab>
  );
};
