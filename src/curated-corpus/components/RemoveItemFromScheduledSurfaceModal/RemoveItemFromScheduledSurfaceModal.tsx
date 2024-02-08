import React from 'react';
import { Modal } from '../../../_shared/components';
import { Box, Grid, Typography } from '@mui/material';
import { FormikValues } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import { ScheduledCorpusItem } from '../../../api/generatedTypes';
import { RemoveItemFromScheduledSurfaceForm, RemoveItemForm } from '../';

interface RemoveItemFromScheduledSurfaceModalProps {
  item: ScheduledCorpusItem;
  isOpen: boolean;
  onSave: (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ) => void | Promise<any>;
  toggleModal: VoidFunction;
}

export const RemoveItemFromScheduledSurfaceModal: React.FC<
  RemoveItemFromScheduledSurfaceModalProps
> = (props): JSX.Element => {
  const { item, isOpen, onSave, toggleModal } = props;
  // whether to show the remove item form
  const isSurfaceEN = item.scheduledSurfaceGuid === 'NEW_TAB_EN_US';

  return (
    <Modal
      open={isOpen}
      handleClose={() => {
        toggleModal();
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <h2>Remove this item from this scheduled surface</h2>
          {isSurfaceEN && (
            <Box mb={1}>
              <Typography variant="subtitle1">
                <em>Title</em>: {item.approvedItem.title}
              </Typography>
            </Box>
          )}
        </Grid>
        <Grid item xs={12}>
          {isSurfaceEN && (
            <Box p={3} mt={-3.5}>
              <RemoveItemForm onSubmit={onSave} onCancel={toggleModal} />
            </Box>
          )}
          {!isSurfaceEN && (
            <RemoveItemFromScheduledSurfaceForm
              onSubmit={onSave}
              onCancel={() => {
                toggleModal();
              }}
              title={item.approvedItem.title}
            />
          )}
        </Grid>
      </Grid>
    </Modal>
  );
};
