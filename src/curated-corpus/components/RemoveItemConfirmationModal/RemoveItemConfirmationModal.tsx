import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';

interface RemoveItemConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemTitle?: string;
}

export const RemoveItemConfirmationModal: React.FC<
  RemoveItemConfirmationModalProps
> = ({ open, onClose, onConfirm, itemTitle }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="remove-dialog-title"
      aria-describedby="remove-dialog-description"
    >
      <DialogTitle id="remove-dialog-title">
        Remove Item from Section
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="remove-dialog-description">
          Are you sure you want to remove{' '}
          {itemTitle ? `"${itemTitle}"` : 'this item'} from the section?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="primary" variant="contained">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};
