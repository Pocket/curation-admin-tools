import React from 'react';
import { Box } from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import { Button } from '../../../_shared/components';

interface LoadExtraButtonProps {
  /**
   * Which icon to show alongside the label of the button.
   */
  arrowDirection: 'up' | 'down';
  /**
   * What text to show on the button itself.
   */
  label: string;
  /**
   * A function to execute when the button is clicked.
   */
  onClick: () => void;
}

/**
 * A 'Load More Results' button, placed below a pageful of results, such as
 * published collections.
 *
 * @param props
 * @constructor
 */
export const LoadExtraButton: React.FC<LoadExtraButtonProps> = (
  props
): JSX.Element => {
  const { arrowDirection, label, onClick } = props;

  return (
    <Box display="flex" justifyContent="center" mt={2}>
      <Button buttonType="positive" variant="text" onClick={onClick}>
        {label}
        {arrowDirection === 'up' && (
          <>
            &nbsp; <ArrowUpwardIcon />
          </>
        )}
        {arrowDirection === 'down' && (
          <>
            &nbsp; <ArrowDownwardIcon />
          </>
        )}
      </Button>
    </Box>
  );
};
