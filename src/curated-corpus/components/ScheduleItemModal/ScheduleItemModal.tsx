import React from 'react';
import { FormikValues } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import { Box, Grid, Typography } from '@material-ui/core';
import { ApprovedCuratedCorpusItem } from '../../api/curated-corpus-api/generatedTypes';
import { Modal } from '../../../_shared/components';
import { ScheduleItemFormConnector } from '../';

interface ScheduleItemModalProps {
  approvedItem: ApprovedCuratedCorpusItem;
  headingCopy?: string;
  isOpen: boolean;
  newTabGuid?: string;
  onSave: (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ) => void | Promise<any>;
  toggleModal: () => void;
}

export const ScheduleItemModal: React.FC<ScheduleItemModalProps> = (
  props
): JSX.Element => {
  const {
    approvedItem,
    headingCopy = 'Schedule this item for New Tab',
    isOpen,
    newTabGuid,
    onSave,
    toggleModal,
  } = props;

  return (
    <Modal
      open={isOpen}
      handleClose={() => {
        toggleModal();
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <h2>{headingCopy}</h2>
          <Box mb={3}>
            <Typography variant="subtitle1">
              <em>Title</em>: {approvedItem.title}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <ScheduleItemFormConnector
            approvedItemExternalId={approvedItem.externalId}
            newTabGuid={newTabGuid}
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
