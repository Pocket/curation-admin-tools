import React, { useState } from 'react';
import { ApolloError } from '@apollo/client';
import {
  Alert,
  Box,
  CircularProgress,
  Collapse,
  Grow,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface HandleApiResponseProps {
  /**
   * Whether the app is waiting for a response from the API
   */
  loading: boolean;

  /**
   * An optional error object in case there is an error
   */
  error?: ApolloError | Error;

  /**
   * Whether the error alert box can be closed
   */

  errorIsDismissible?: boolean;

  /**
   * A message to show to the waiting user alongside the loading icon
   */
  loadingText?: string;
}

/**
 * A wrapper component that displays a loading component while the API call
 * is in progress and any errors if the API call was unsuccessful.
 *
 * @param props
 */
export const HandleApiResponse: React.FC<HandleApiResponseProps> = (
  props
): JSX.Element | null => {
  const [isErrorVisible, setIsErrorVisible] = useState(true);

  const { loading, error, errorIsDismissible = true, loadingText = '' } = props;

  if (loading) {
    return (
      <Grow in={loading} timeout={1000}>
        <Box
          flex="1"
          display="flex"
          justifyContent="center"
          alignItems="center"
          textAlign="center"
          p={7}
        >
          <CircularProgress /> {loadingText}
        </Box>
      </Grow>
    );
  }

  if (error) {
    let messages: string[] = [];

    if (error instanceof ApolloError) {
      const { graphQLErrors, networkError, extraInfo } = error;

      if (graphQLErrors)
        messages = graphQLErrors.map(
          ({ message }) => `[GraphQL error]: ${message}`
        );

      if (networkError) {
        messages.push(`[Network error]: ${networkError}`);
      }

      if (extraInfo) {
        messages.push(extraInfo);
      }
    } else {
      messages.push(error.toString());
    }

    return (
      <Collapse in={isErrorVisible}>
        <Box my={3}>
          <Alert
            action={
              errorIsDismissible ? (
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setIsErrorVisible(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              ) : undefined
            }
            severity="error"
            variant="filled"
            sx={{ fontWeight: 400, fontSize: '0.875rem' }}
          >
            {messages}
          </Alert>
        </Box>
      </Collapse>
    );
  }

  return null;
};
