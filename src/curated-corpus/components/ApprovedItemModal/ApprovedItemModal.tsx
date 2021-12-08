import React from 'react';
import { Modal } from '../../../_shared/components';
import { Box, Grid, Typography } from '@material-ui/core';
import { ApprovedCuratedCorpusItem } from '../../api/curated-corpus-api/generatedTypes';
import { FormikValues } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import { ApprovedItemForm } from '../ApprovedItemForm/ApprovedItemForm';

interface ApprovedItemModalProps {
  approvedItem: ApprovedCuratedCorpusItem;
  isOpen: boolean;
  onSave: (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ) => void | Promise<any>;
  toggleModal: () => void;
  onImageSave: (url: string) => void;
}

export const ApprovedItemModal: React.FC<ApprovedItemModalProps> = (
  props
): JSX.Element => {
  const { approvedItem, isOpen, onSave, toggleModal, onImageSave } = props;

  return (
    <Modal
      open={isOpen}
      handleClose={() => {
        toggleModal();
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <h2>Edit Item</h2>
          <Box mb={3}>
            <Typography variant="subtitle1">
              <em>Title</em>: {approvedItem.title}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <ApprovedItemForm
            approvedItem={approvedItem}
            onSubmit={onSave}
            onCancel={toggleModal}
            onImageSave={onImageSave}
          />
        </Grid>
      </Grid>
    </Modal>
  );
};
