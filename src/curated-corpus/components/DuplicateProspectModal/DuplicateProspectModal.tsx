import React from 'react';
import { Grid, Typography } from '@mui/material';
import { ApprovedCorpusItem } from '../../../api/generatedTypes';
import { Modal, SharedFormButtons } from '../../../_shared/components';
import { useStyles } from './DuplicateProspectModal.styles';

interface DuplicateProspectModalProps {
  /**
   * Whether the modal is visible on the screen or not.
   */
  isOpen: boolean;

  /**
   * Toggle the DuplicateProspectModal to show/hide as necessary.
   */
  toggleModal: VoidFunction;

  /**
   * Item of type ApprovedCorpusItem.
   */
  approvedItem: ApprovedCorpusItem;
}

/**
 * This component renders a simple modal that links to the curation history page of an already existing prospect.
 */
export const DuplicateProspectModal: React.FC<DuplicateProspectModalProps> = (
  props
): JSX.Element => {
  const classes = useStyles();
  const { isOpen, toggleModal, approvedItem } = props;

  /**
   *  on click function used by "View item curation history" button
   *  opens the link in the new tab and toggles off the modal
   */
  const onClick = () => {
    window.open(
      `/curated-corpus/corpus/item/${approvedItem.externalId}`,
      '_blank'
    );

    toggleModal();
  };

  return (
    <Modal open={isOpen} handleClose={toggleModal}>
      <Grid container direction="column" className={classes.root}>
        <Grid item xs={12}>
          <h2>Duplicate Item</h2>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">
            <em>Title</em>: {approvedItem.title}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1} className={classes.buttonContainer}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" align="center">
                This item is already in the corpus
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <SharedFormButtons
                saveButtonLabel="View item curation history"
                onSave={onClick}
                onCancel={toggleModal}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Modal>
  );
};
