import React from 'react';
import { Box, CircularProgress } from '@material-ui/core';
import { Button } from '../';

interface LoadMoreProps {
  /**
   * Whether the button is disabled - it *should* be disabled if no more results
   * exist for a query.
   */
  buttonDisabled: boolean;

  /**
   * A function to execute when the button is clicked.
   */
  loadMore: () => void;

  /**
   * Whether to show a loading spinner as part of the button label
   * to indicate request status.
   */
  showSpinner: boolean;
}

/**
 * A 'Load More Results' button, placed below a pageful of results, such as
 * published collections.
 *
 * @param props
 * @constructor
 */
export const LoadMore: React.FC<LoadMoreProps> = (props): JSX.Element => {
  const { buttonDisabled, loadMore, showSpinner } = props;

  return (
    <Box display="flex" justifyContent="center" mt={2}>
      <Button buttonType="hollow" onClick={loadMore} disabled={buttonDisabled}>
        Load More Results
        {showSpinner && (
          <>
            &nbsp;
            <CircularProgress size={14} />
          </>
        )}
      </Button>
    </Box>
  );
};
