import React from 'react';
import { Link } from 'react-router-dom';
import { Grid, Typography } from '@material-ui/core';
import { ApprovedCorpusItem } from '../../../api/generatedTypes';
import { Button, Modal } from '../../../_shared/components';
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
              <Button buttonType="positive" variant="text">
                <Link
                  to={`/curated-corpus/corpus/item/${approvedItem.externalId}`}
                  className={classes.link}
                >
                  View item curation history
                </Link>
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Modal>
  );
};
