import React from 'react';
import { Grid } from '@mui/material';
import { Modal } from '../../../_shared/components';
import { AddLabelFormConnector } from '../';
// import { Label } from '../../../api/generatedTypes';

interface AddLabelModalProps {
  /**
   * Whether the modal is visible on the screen or not.
   */
  isOpen: boolean;

  /**
   * Toggle the AddLabelModalProps to show/hide as necessary.
   */
  toggleModal: VoidFunction;

  /**
   * A helper function from Apollo Client that triggers a new API call to refetch
   * the data for a given query.
   */
  refetch: VoidFunction;
}

/**
 * Parent component for the AddLabelModal component
 */
export const AddLabelModal: React.FC<AddLabelModalProps> = (
  props
): JSX.Element => {
  const { isOpen, toggleModal, refetch } = props;

  return (
    <Modal open={isOpen} handleClose={toggleModal}>
      <Grid container direction="column">
        <Grid item>
          <h2>Add a New Label</h2>
        </Grid>
        <Grid item></Grid>
        <AddLabelFormConnector toggleModal={toggleModal} refetch={refetch} />
      </Grid>
    </Modal>
  );
};
