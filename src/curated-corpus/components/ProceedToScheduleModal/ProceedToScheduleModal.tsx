import React from 'react';
import { Modal, SharedFormButtons } from '../../../_shared/components';
import { Box, Grid, Typography } from '@material-ui/core';

interface ProceedToScheduleModalProps {
  isOpen: boolean;
  onConfirm: VoidFunction;
  toggleModal: VoidFunction;
}

export const ProceedToScheduleModal: React.FC<ProceedToScheduleModalProps> = (
  props
): JSX.Element => {
  const { isOpen, onConfirm, toggleModal } = props;

  return (
    <Modal
      open={isOpen}
      handleClose={() => {
        toggleModal();
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <h2>Schedule on New Tab</h2>
          <Typography>
            Would you like to schedule this story to appear on New Tab?
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Box p={3}>
            <SharedFormButtons
              onSave={onConfirm}
              onCancel={toggleModal}
              saveButtonLabel="Yes, please!"
              cancelButtonLabel="No thanks"
            />
          </Box>
        </Grid>
      </Grid>
    </Modal>
  );
};
