import React from 'react';
import { Modal, SharedFormButtons } from '../../../_shared/components';
import { Box, Grid, Typography } from '@mui/material';

interface RefreshProspectsModalProps {
  isOpen: boolean;
  onConfirm: VoidFunction;
  toggleModal: VoidFunction;
}

export const RefreshProspectsModal: React.FC<RefreshProspectsModalProps> = (
  props
): JSX.Element => {
  const { isOpen, onConfirm, toggleModal } = props;

  //TODO @Herraj cancel button outline is primary color instead of neutral (grey)
  return (
    <Modal
      open={isOpen}
      handleClose={() => {
        toggleModal();
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <h2>Refresh Prospects?</h2>
          <Typography>
            There are still some prospects remaining on the page.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Box p={3}>
            <SharedFormButtons
              onSave={onConfirm}
              onCancel={toggleModal}
              saveButtonLabel="Confirm"
            />
          </Box>
        </Grid>
      </Grid>
    </Modal>
  );
};
