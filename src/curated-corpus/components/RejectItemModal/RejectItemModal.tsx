import React from 'react';
import { Alert, Box, Grid, Typography } from '@mui/material';
import { FormikValues } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import { ApprovedCorpusItem, Prospect } from '../../../api/generatedTypes';
import { Modal } from '../../../_shared/components';
import { RejectItemForm } from '../';

interface RejectProspectModalProps {
  prospect: Prospect | ApprovedCorpusItem;
  isOpen: boolean;
  onSave: (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>,
  ) => void | Promise<any>;
  toggleModal: () => void;
}

export const RejectItemModal: React.FC<RejectProspectModalProps> = (
  props,
): JSX.Element => {
  const { prospect, isOpen, onSave, toggleModal } = props;

  return (
    <Modal
      open={isOpen}
      handleClose={() => {
        toggleModal();
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <h2>Reject this item from inclusion in the curated corpus</h2>
          <Box mb={1}>
            <Typography variant="subtitle1">
              <em>Title</em>: {prospect.title}
            </Typography>
            <br />
            <Alert severity="warning">
              <strong>Notice</strong>: This item will be removed from all
              Sections.
            </Alert>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box p={3}>
            <RejectItemForm
              onSubmit={onSave}
              onCancel={() => {
                toggleModal();
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Modal>
  );
};
