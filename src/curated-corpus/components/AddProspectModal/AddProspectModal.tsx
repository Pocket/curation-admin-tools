import { Grid } from '@material-ui/core';
import React from 'react';
import { AddProspectForm } from '..';

import { SharedFormButtonsProps, Modal } from '../../../_shared/components';

interface AddProspectModalProps {
  isOpen: boolean;

  toggleModal: VoidFunction;
}

/**
 * Parent component for the AddProspectForm component
 */
export const AddProspectModal: React.FC<
  AddProspectModalProps & SharedFormButtonsProps
> = (props): JSX.Element => {
  const { isOpen, toggleModal } = props;

  return (
    <Modal open={isOpen} handleClose={toggleModal}>
      <Grid container direction="column">
        <Grid item>
          <h2>Add a New Prospect</h2>
        </Grid>
        <Grid item>
          <AddProspectForm
            onCancel={toggleModal}
            toggleAddProspectModal={toggleModal}
          />
        </Grid>
      </Grid>
    </Modal>
  );
};
