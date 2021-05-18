import React from 'react';
import { useSnackbar, VariantType } from 'notistack';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

interface useNotificationsReturnValues {
  showNotification: (message: string, type: VariantType | undefined) => void;
}

/**
 * Returns a helper method that allows us to queue a toast notification
 * from anywhere in the app
 */
export const useNotifications = (): useNotificationsReturnValues => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  // Add a "Close" icon to each notification
  const action = (key: string) => (
    <>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={() => {
          closeSnackbar(key);
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  /**
   * Show a notification to the user whether the action (such as saving a record)
   * has completed successfully.
   */
  const showNotification = (
    message: string,
    type: VariantType | undefined
  ): void => {
    enqueueSnackbar(message, {
      variant: type,
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'center',
      },
      action,
      // keep error messages on the page until the user dismisses them
      autoHideDuration: type === 'error' ? undefined : 3000,
    });
  };

  return { showNotification };
};
