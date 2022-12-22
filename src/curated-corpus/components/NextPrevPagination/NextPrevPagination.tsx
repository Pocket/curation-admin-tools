import React from 'react';
import { Button } from '../../../_shared/components';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box } from '@mui/material';

interface NextPrevPaginationProps {
  /**
   * Whether to show the "Next Page" button.
   */
  hasNextPage: boolean;
  /**
   * Function to run when the user clicks on the "Next Page" button.
   */
  loadNext: () => void;
  /**
   * Whether to show the "Previous Page" button.
   */
  hasPreviousPage: boolean;
  /**
   * Function to run when the user clicks on the "Previous Page" button.
   */
  loadPrevious: () => void;
}

/**
 * A simple component that shows up to two centered buttons - "Previous Page"
 * and "Next Page" to facilitate paginating through search results.
 *
 * @param props
 * @constructor
 */
export const NextPrevPagination: React.FC<NextPrevPaginationProps> = (
  props
): JSX.Element => {
  const { hasNextPage, loadNext, hasPreviousPage, loadPrevious } = props;

  return (
    <Box display="flex" justifyContent="center" m={2}>
      {hasPreviousPage && (
        <Button variant="text" onClick={loadPrevious}>
          <ArrowBackIcon /> Previous Page
        </Button>
      )}

      {hasNextPage && (
        <Button variant="text" onClick={loadNext}>
          Next Page
          <ArrowForwardIcon />
        </Button>
      )}
    </Box>
  );
};
