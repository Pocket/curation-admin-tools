import React from 'react';
import { Modal } from '../../../_shared/components';
import { Box, Grid, Typography } from '@mui/material';
import { FormikValues } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import { ScheduledCorpusItem } from '../../../api/generatedTypes';
import { RemoveItemForm, RemoveItemFromScheduledSurfaceForm } from '../';

interface RemoveItemFromScheduledSurfaceModalProps {
  item: ScheduledCorpusItem;
  isOpen: boolean;
  onSave: (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>,
  ) => void | Promise<any>;
  toggleModal: VoidFunction;
}

export const RemoveItemFromScheduledSurfaceModal: React.FC<
  RemoveItemFromScheduledSurfaceModalProps
> = (props): JSX.Element => {
  const { item, isOpen, onSave, toggleModal } = props;
  // Surfaces for which unsheduling/removal reasons are required
  const surfaces = ['NEW_TAB_EN_US', 'NEW_TAB_DE_DE'];

  // Whether to show the remove item form
  const showRemovalReasons = surfaces.includes(item.scheduledSurfaceGuid);

  return (
    <Modal
      open={isOpen}
      handleClose={() => {
        toggleModal();
      }}
    >
      <Grid container spacing={2}>
        {showRemovalReasons && (
          <>
            <Grid item xs={12}>
              <h2>Reason(s) for Unscheduling this item</h2>
              <Box mb={1}>
                <Typography variant="subtitle1">
                  <em>Title</em>: {item.approvedItem.title}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Box p={3} mt={-3.5}>
                <RemoveItemForm onSubmit={onSave} onCancel={toggleModal} />
              </Box>
            </Grid>
          </>
        )}
        {!showRemovalReasons && (
          <Grid item xs={12}>
            <h2>Remove this item from this scheduled surface</h2>
            <RemoveItemFromScheduledSurfaceForm
              onSubmit={onSave}
              onCancel={() => {
                toggleModal();
              }}
              title={item.approvedItem.title}
            />
          </Grid>
        )}
      </Grid>
    </Modal>
  );
};
