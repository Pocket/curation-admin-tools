import React from 'react';
import { Modal } from '../../../_shared/components';
import { Grid } from '@material-ui/core';
import { ScheduledCuratedCorpusItem } from '../../../api/generatedTypes';
import { FormikValues } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import { RemoveItemFromScheduledSurfaceForm } from '../';

interface RemoveItemFromScheduledSurfaceModalProps {
  item: ScheduledCuratedCorpusItem;
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
        </Grid>
        <Grid item xs={12}>
          <RemoveItemFromScheduledSurfaceForm
            onSubmit={onSave}
            onCancel={() => {
              toggleModal();
            }}
            title={item.approvedItem.title}
          />
        </Grid>
      </Grid>
    </Modal>
  );
};
