import React from 'react';
import { Chip as MuiChip, ChipProps } from '@material-ui/core';
import { useStyles } from './Chip.styles';

/**
 * A custom Chip component that shows a number in a pill-like element.
 */
export const Chip: React.FC<ChipProps> = (props): JSX.Element => {
  const { label, color } = props;

  return (
    <MuiChip classes={useStyles()} label={label} size="small" color={color} />
  );
};
