import React from 'react';
import { Grid } from '@mui/material';
import { Modal } from '../../../_shared/components';
import { AddLabelFormConnector } from '../';
import { Label } from '../../../api/generatedTypes';

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
   * state variable from Parent component LabelList Page
   * */
  setLabelsList: React.Dispatch<React.SetStateAction<Label[]>>;
}

/**
 * Parent component for the AddLabelModal component
 */
export const AddLabelModal: React.FC<AddLabelModalProps> = (
  props
): JSX.Element => {
  const { isOpen, toggleModal, setLabelsList } = props;

  return (
    <Modal open={isOpen} handleClose={toggleModal}>
      <Grid container direction="column">
        <Grid item>
          <h2>Add a New Label</h2>
        </Grid>
        <Grid item></Grid>
        <AddLabelFormConnector
          toggleModal={toggleModal}
          setLabelsList={setLabelsList}
        />
      </Grid>
    </Modal>
  );
};
