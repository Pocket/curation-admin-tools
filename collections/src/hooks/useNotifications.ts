import React, { useState } from 'react';

interface useNotificationsReturnValues {
  open: boolean;
  message: string;
  hasError: boolean;
  showNotification: (message: string, isError: boolean) => void;
  handleClose: (event?: React.SyntheticEvent, reason?: string) => void;
}

/**
 * The Notification component needs its state managed
 * from the next level up (at least), and so as not to repeat ourselves
 * on every page where the Notification component is used, setting
 * up state vars and helper methods for it happens within a custom hook
 */
export const useNotifications = (): useNotificationsReturnValues => {
  // These are used to display or hide notifications with messages from the API
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);

  /**
   * Show a notification to the user whether the action (such as saving a record)
   * has completed successfully.
   */
  const showNotification = (message: string, isError = false): void => {
    setHasError(isError);
    setMessage(message);
    setOpen(true);
  };

  /**
   * Close the toast notification
   */
  const handleClose = (event?: React.SyntheticEvent, reason?: string): void => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return { open, message, hasError, showNotification, handleClose };
};
