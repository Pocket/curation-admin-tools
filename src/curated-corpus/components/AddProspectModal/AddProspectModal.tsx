import React from 'react';
import { Grid } from '@material-ui/core';
import { Prospect } from '../../../api/generatedTypes';
import { AddProspectFormConnector } from '..';
import { Modal } from '../../../_shared/components';

interface AddProspectModalProps {
  /**
   * Whether the modal is visible on the screen or not.
   */
  isOpen: boolean;

  /**
   * Toggle the AddProspectModal to show/hide as necessary.
   */
  toggleModal: VoidFunction;

  /**
   * Toggle the modal that contains the ApprovedItem form as necessary.
   */
  toggleApprovedItemModal: VoidFunction;

  /**
   * A setter for the current prospect to be worked on. This is passed
   * through straight to the AddProspectFormConnector component where you will
   * find a detailed explanation why it's needed there.
   */
  setCurrentProspect: (currentProspect: Prospect) => void;
}

/**
 * Parent component for the AddProspectFormConnector component
 */
export const AddProspectModal: React.FC<AddProspectModalProps> = (
  props
): JSX.Element => {
  const { isOpen, toggleModal, setCurrentProspect, toggleApprovedItemModal } =
    props;

  return (
    <Modal open={isOpen} handleClose={toggleModal}>
      <Grid container direction="column">
        <Grid item>
          <h2>Add a New Curated Item</h2>
        </Grid>
        <Grid item>
          <AddProspectFormConnector
            toggleModal={toggleModal}
            toggleApprovedItemModal={toggleApprovedItemModal}
            setCurrentProspect={setCurrentProspect}
          />
        </Grid>
      </Grid>
    </Modal>
  );
};
