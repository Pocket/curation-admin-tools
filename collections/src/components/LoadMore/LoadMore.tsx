import React from 'react';
import { Box, CircularProgress } from '@material-ui/core';
import { Button } from '../';

interface LoadMoreProps {
  buttonDisabled: boolean;

  loadMore: () => void;

  showSpinner: boolean;
}

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
