import React from 'react';
import { Modal } from '../../../_shared/components';
import { Grid } from '@material-ui/core';
import { ScheduledCuratedCorpusItem } from '../../api/curated-corpus-api/generatedTypes';
import { FormikValues } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import { RemoveItemFromNewTabForm } from '../';

interface RemoveItemFromNewTabModalProps {
  item: ScheduledCuratedCorpusItem;
  isOpen: boolean;
  onSave: (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ) => void | Promise<any>;
  toggleModal: VoidFunction;
}

export const RemoveItemFromNewTabModal: React.FC<
  RemoveItemFromNewTabModalProps
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
          <h2>Remove this item from New Tab</h2>
        </Grid>
        <Grid item xs={12}>
          <RemoveItemFromNewTabForm
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
