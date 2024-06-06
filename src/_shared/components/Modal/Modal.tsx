import React from 'react';
import {
  Box,
  Dialog,
  DialogProps,
  useMediaQuery,
  useTheme,
} from '@mui/material';

interface ModalProps {
  handleClose: () => void;
}

/**
 * A simple modal widget.
 *
 * @returns JSX.Element Modal overlay over the entire screen
 */
export const Modal: React.FC<ModalProps & DialogProps> = (
  props,
): JSX.Element => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { open, children, handleClose } = props;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullScreen={fullScreen}
      maxWidth="md"
    >
      <Box
        flex="1"
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={2}
      >
        {children}
      </Box>
    </Dialog>
  );
};
