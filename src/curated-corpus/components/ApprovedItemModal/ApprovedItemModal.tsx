import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import { FormikValues } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import { ApprovedCorpusItem } from '../../../api/generatedTypes';
import { Modal } from '../../../_shared/components';
import { ApprovedItemForm } from '../ApprovedItemForm/ApprovedItemForm';
import { ApprovedItemFromProspect } from '../../helpers/definitions';

interface ApprovedItemModalProps {
  approvedItem: ApprovedCorpusItem | ApprovedItemFromProspect;
  isOpen: boolean;
  heading?: string;
  showItemTitle?: boolean;
  onSave: (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>,
  ) => void | Promise<any>;
  toggleModal: () => void;
  isRecommendation?: boolean;
  onImageSave?: (url: string) => void;
}

export const ApprovedItemModal: React.FC<ApprovedItemModalProps> = (
  props,
): JSX.Element => {
  const {
    approvedItem,
    showItemTitle,
    heading,
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
          {heading && <h2>{heading}</h2>}
          <Box mb={3}>
            <Typography variant="subtitle1">
              {showItemTitle && (
                <>
                  <em>Title: </em> {approvedItem.title}
                </>
              )}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <ApprovedItemForm
            approvedItem={approvedItem}
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
