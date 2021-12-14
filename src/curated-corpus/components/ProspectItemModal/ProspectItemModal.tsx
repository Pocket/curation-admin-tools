import React from 'react';
import { Modal } from '../../../_shared/components';
import { Box, Grid, Typography } from '@material-ui/core';
import { Prospect } from '../../api/prospect-api/generatedTypes';
import { FormikValues } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import { ProspectItemForm } from '../ProspectItemForm/ProspectItemForm';

interface ProspectItemModalProps {
  prospectItem: Prospect;
  isRecommendation: boolean;
  isOpen: boolean;
  onSave: (
    prospect: Prospect,
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ) => void | Promise<any>;
  toggleModal: () => void;
  onImageSave: (url: string) => void;
}

export const ProspectItemModal: React.FC<ProspectItemModalProps> = (
  props
): JSX.Element => {
  const {
    prospectItem,
    isRecommendation,
    isOpen,
    onSave,
    toggleModal,
    onImageSave,
  } = props;

  return (
    <Modal
      open={isOpen}
      handleClose={() => {
        toggleModal();
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <h2>
            {isRecommendation ? 'Recommend Prospect' : 'Add Prospect to Corpus'}
          </h2>
          <Box mb={3}>
            <Typography variant="subtitle1">
              <em>Title</em>: {prospectItem.title}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <ProspectItemForm
            prospectItem={prospectItem}
            isRecommendation={isRecommendation}
            onSubmit={onSave}
            onCancel={toggleModal}
            onImageSave={onImageSave}
          />
        </Grid>
      </Grid>
    </Modal>
  );
};
