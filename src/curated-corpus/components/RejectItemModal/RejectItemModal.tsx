import React from 'react';
import { Modal } from '../../../_shared/components';
import { Box, Grid, Typography } from '@material-ui/core';
import { FormikValues } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import { Prospect } from '../../../api/generatedTypes';
import { RejectItemForm } from '../RejectItemForm/RejectItemForm';
import { ApprovedCuratedCorpusItem } from '../../../api/generatedTypes';

interface RejectProspectModalProps {
  prospect: Prospect | ApprovedCuratedCorpusItem;
  isOpen: boolean;
  onSave: (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ) => void | Promise<any>;
  toggleModal: () => void;
}

export const RejectItemModal: React.FC<RejectProspectModalProps> = (
  props
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
