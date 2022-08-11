import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { ApprovedCorpusItem } from '../../../api/generatedTypes';
import { Modal } from '../../../_shared/components';

interface DuplicateProspectModalProps {
  /**
   * Whether the modal is visible on the screen or not.
   */
  isOpen: boolean;

  /**
   * Toggle the DuplicateProspectModal to show/hide as necessary.
   */
  toggleModal: VoidFunction;

  //TODO: fix comment
  approvedItem: ApprovedCorpusItem;
}

//TODO: fix comment
//TODO: fix modal body copy
export const DuplicateProspectModal: React.FC<DuplicateProspectModalProps> = (
  props
): JSX.Element => {
  const { isOpen, toggleModal, approvedItem } = props;

  return (
    <Modal open={isOpen} handleClose={toggleModal}>
      <Grid container direction="column">
        <Grid item>
          <h2>Duplicate Prospect</h2>
        </Grid>
        <Grid item>
          <Typography variant="body1">
            <a href={approvedItem.url}>See details</a>
          </Typography>
        </Grid>
      </Grid>
    </Modal>
  );
};
