import { Grid } from '@material-ui/core';
import React from 'react';
import { AddProspectFormConnector } from '..';

import { Modal, SharedFormButtonsProps } from '../../../_shared/components';
import { ApprovedCuratedCorpusItem } from '../../../api/generatedTypes';

interface AddProspectModalProps {
  isOpen: boolean;

  toggleModal: VoidFunction;

  /**
   *
   */
  approvedItem: ApprovedCuratedCorpusItem | undefined;

  /**
   *
   */
  setApprovedItem: (approvedItem: ApprovedCuratedCorpusItem) => void;
}

/**
 * Parent component for the AddProspectForm component
 */
export const AddProspectModal: React.FC<
  AddProspectModalProps & SharedFormButtonsProps
> = (props): JSX.Element => {
  const { isOpen, toggleModal, approvedItem, setApprovedItem } = props;

  return (
    <Modal open={isOpen} handleClose={toggleModal}>
      <Grid container direction="column">
        <Grid item>
          <h2>Add a New Curated Item</h2>
        </Grid>
        <Grid item>
          <AddProspectFormConnector
            toggleModal={toggleModal}
            approvedItem={approvedItem}
            setApprovedItem={setApprovedItem}
          />
        </Grid>
      </Grid>
    </Modal>
  );
};
