import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { FormikValues } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import { Modal } from '../../../_shared/components';
import { RemoveSectionItemForm } from '../';

interface RemoveSectionItemModalProps {
  itemTitle: string;
  isOpen: boolean;
  onSave: (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>,
  ) => void | Promise<any>;
  toggleModal: VoidFunction;
}

export const RemoveSectionItemModal: React.FC<RemoveSectionItemModalProps> = (
  props,
) => {
  const { itemTitle, isOpen, onSave, toggleModal } = props;
  return (
    <Modal open={isOpen} handleClose={toggleModal}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <h2>Remove this section item</h2>
          <Box mb={1}>
            <Typography variant="subtitle1">
              <em>Title</em>: {itemTitle}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box p={3} mt={-3.5}>
            <RemoveSectionItemForm onSubmit={onSave} onCancel={toggleModal} />
          </Box>
        </Grid>
      </Grid>
    </Modal>
  );
};
