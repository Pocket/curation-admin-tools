import React from 'react';
import { useSnackbar, VariantType } from 'notistack';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

/**
 * This interface defines the signature of the helper function this hook returns.
 */
interface useNotificationsReturnValues {
  showNotification: (message: string, type: VariantType | undefined) => void;
}

/**
 * Returns a helper function that allows us to queue a toast notification
 * from anywhere in the app.
 *
 * Thanks to the notistack package, these notifications stack on top of each
 * other instead of getting replaced by each subsequent notification
 * as a single MUI toast message would (sometimes we send out a whole bunch
 * of notifications one after another, such as when you reorder stories
 * in a collection.
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
      // This is the close button we defined above
      action,
      // Where to place the toast message on the screen
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'center',
      },
      // Keep error messages on the page until the user dismisses them
      // and automatically hide all other messages after three seconds
      autoHideDuration: type === 'error' ? undefined : 3000,
      // enable multi-line messages (use \n)
      style: { whiteSpace: 'pre-line' },
      // One of 'default' | 'error' | 'success' | 'warning' | 'info'
      variant: type,
    });
  };

  return { showNotification };
};
