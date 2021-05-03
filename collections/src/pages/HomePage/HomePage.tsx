import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button } from '@material-ui/core';

/**
 * Home Page
 */
export const HomePage = (): JSX.Element => {
  return (
    <>
      <h2>Latest Draft Collections</h2>
      <Box display="flex" justifyContent="center">
        <Button
          component={Link}
          size="large"
          color="primary"
          to="/collections/"
        >
          See all
        </Button>
      </Box>

      <h2>Latest Published Collections</h2>
      <Box display="flex" justifyContent="center">
        <Button
          component={Link}
          size="large"
          color="primary"
          to="/collections/published"
        >
          See all
        </Button>
      </Box>
    </>
  );
};
