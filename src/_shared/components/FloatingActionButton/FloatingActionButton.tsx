import React from 'react';
import { Fab, IconButton } from '@material-ui/core';
import { ArrowUpward } from '@material-ui/icons';
import { useStyles } from './FloatingActionButton.styles';

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
  const classes = useStyles();

  return (
    <Fab color="default" size="medium" className={classes.bottomRightFloating}>
      <IconButton title="Scroll to top" onClick={onClick}>
        <ArrowUpward />
      </IconButton>
    </Fab>
  );
};
