import React from 'react';
import { Modal } from '../../../_shared/components';
import { Box, Grid, Typography } from '@material-ui/core';
import { ScheduleCuratedItemForm } from '../';
import { newTabs } from '../../helpers/definitions';
import { CuratedItem } from '../../api/curated-corpus-api/generatedTypes';

interface ScheduleCuratedItemModalProps {
  curatedItem: CuratedItem;
  isOpen: boolean;
  toggleModal: () => void;
}

export const ScheduleCuratedItemModal: React.FC<ScheduleCuratedItemModalProps> =
  (props): JSX.Element => {
    const { curatedItem, isOpen, toggleModal } = props;

    return (
      <Modal
        open={isOpen}
        handleClose={() => {
          toggleModal();
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <h2>Schedule this item for New Tab</h2>
            <Box mb={3}>
              <Typography variant="subtitle1">
                <em>Title</em>: {curatedItem.title}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <ScheduleCuratedItemForm
              curatedItemExternalId={curatedItem.externalId}
              newTabList={newTabs}
              onSubmit={() => {
                // nothing to see here
              }}
              onCancel={() => {
                toggleModal();
              }}
            />
          </Grid>
        </Grid>
      </Modal>
    );
  };