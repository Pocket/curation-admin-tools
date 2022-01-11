import React from 'react';
import { FormikValues } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import { Box, Grid, Typography } from '@material-ui/core';
import { ApprovedCuratedCorpusItem } from '../../api/curated-corpus-api/generatedTypes';
import { Modal } from '../../../_shared/components';
import { ScheduleItemFormConnector } from '../';

interface ScheduleItemModalProps {
  approvedItem: ApprovedCuratedCorpusItem;
  isOpen: boolean;
  onSave: (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ) => void | Promise<any>;
  toggleModal: () => void;
}

export const ScheduleItemModal: React.FC<ScheduleItemModalProps> = (
  props
): JSX.Element => {
  const { approvedItem, isOpen, onSave, toggleModal } = props;

  return (
    <Modal
      open={isOpen}
      handleClose={() => {
        toggleModal();
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <h2>Schedule this item for New Tab</h2>
          <Box mb={3}>
            <Typography variant="subtitle1">
              <em>Title</em>: {approvedItem.title}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <ScheduleItemFormConnector
            approvedItemExternalId={approvedItem.externalId}
            onSubmit={onSave}
            onCancel={() => {
              toggleModal();
            }}
          />
        </Grid>
      </Grid>
    </Modal>
  );
};
