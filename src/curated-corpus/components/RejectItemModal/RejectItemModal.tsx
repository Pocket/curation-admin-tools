import React from 'react';
import { Alert, Box, Grid, Typography } from '@mui/material';
import { FormikValues } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import { ApprovedCorpusItem } from '../../../api/generatedTypes';
import { Modal } from '../../../_shared/components';
import { RejectItemForm } from '../';

interface RejectItemModalProps {
  item: ApprovedCorpusItem;
  isOpen: boolean;
  onSave: (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>,
  ) => void | Promise<any>;
  toggleModal: () => void;
}

export const RejectItemModal: React.FC<RejectItemModalProps> = (
  props,
): JSX.Element => {
  const { item, isOpen, onSave, toggleModal } = props;

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
              <em>Title</em>: {item.title}
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
