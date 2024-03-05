import React from 'react';
import { FormikValues } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import { Box, Grid, Typography } from '@mui/material';
import { ApprovedCorpusItem } from '../../../api/generatedTypes';
import { Modal } from '../../../_shared/components';
import { ReasonsToAddForm } from '../ReasonsToAddForm/ReasonsToAddForm';

interface ReasonsToAddModalProps {
  /**
   * The approved corpus item the reasons are added for is meant for.
   */
  approvedItem: ApprovedCorpusItem;

  /**
   * Whether the modal is visible or not.
   */
  isOpen: boolean;

  /**
   * The scheduled surface GUID that should be selected, if provided
   */
  scheduledSurfaceGuid?: string;

  /**
   * The action to run when the user hits the "Save" button at the bottom of the modal.
   * @param values
   * @param formikHelpers
   */
  onSave: (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ) => void | Promise<any>;

  /**
   * A helper function that toggles the visibility of the modal on and off.
   */
  toggleModal: VoidFunction;
}

/**
 * This modal opens a form that asks the curators to provide one or more
 * reasons for adding a curated item to the corpus manually.
 *
 * @param props
 * @constructor
 */
export const ReasonsToAddModal: React.FC<ReasonsToAddModalProps> = (
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
          <h2>Confirm Schedule</h2>
          <Box mb={3}>
            <Typography variant="subtitle1">
              <em>Title</em>: {approvedItem.title}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <ReasonsToAddForm onSubmit={onSave} onCancel={toggleModal} />
        </Grid>
      </Grid>
    </Modal>
  );
};
