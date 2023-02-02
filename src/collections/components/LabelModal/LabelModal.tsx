import React from 'react';
import { Grid } from '@mui/material';
import { Modal } from '../../../_shared/components';
import { LabelFormConnector } from '../';
import { Label } from '../../../api/generatedTypes';

interface LabelModalProps {
  /**
   * Whether the modal is visible on the screen or not.
   */
  isOpen: boolean;

  /**
   * Toggle the LabelModalProps to show/hide as necessary.
   */
  toggleModal: VoidFunction;

  /**
   * Label Modal custom title.
   */
  modalTitle: string;

  /**
   * A helper function from Apollo Client that triggers a new API call to refetch
   * the data for a given query.
   */
  refetch: VoidFunction;

  /**
   * An object with everything label-related in it. It is optional because it is only
   * relevant when updating a label.
   */
  label?: Label;

  /**
   * Whether or not to run the createLabel mutation.
   */
  runCreateLabelMutation?: boolean;

  /**
   * Whether or not to run the updateLabel mutation.
   */
  runUpdateLabelMutation?: boolean;
}

/**
 * Parent component for the LabelModal component
 */
export const LabelModal: React.FC<LabelModalProps> = (props): JSX.Element => {
  const {
    isOpen,
    toggleModal,
    modalTitle,
    refetch,
    label,
    runCreateLabelMutation,
    runUpdateLabelMutation,
  } = props;

  return (
    <Modal open={isOpen} handleClose={toggleModal}>
      <Grid container direction="column">
        <Grid item>
          <h2>{modalTitle}</h2>
        </Grid>
        <Grid item></Grid>
        <LabelFormConnector
          toggleModal={toggleModal}
          refetch={refetch}
          label={label}
          runCreateLabelMutation={runCreateLabelMutation}
          runUpdateLabelMutation={runUpdateLabelMutation}
        />
      </Grid>
    </Modal>
  );
};
