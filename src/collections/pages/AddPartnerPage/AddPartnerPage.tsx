import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Paper } from '@mui/material';
import { FormikValues } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import { PartnerForm } from '../../components';
import { useNotifications } from '../../../_shared/hooks';
import {
  CollectionPartner,
  GetCollectionPartnersDocument,
  useCreateCollectionPartnerMutation,
} from '../../../api/generatedTypes';
import { config } from '../../../config';

export const AddPartnerPage: React.FC = (): JSX.Element => {
  // Prepare state vars and helper methods for API notifications
  const { showNotification } = useNotifications();

  // This is used to redirect the user to the full author page once
  // the record is added successfully
  const history = useHistory();

  // Provide a default collection partner object for the form
  const partner: CollectionPartner = {
    externalId: '',
    name: '',
    url: '',
    imageUrl: '',
    blurb: '',
  };

  // prepare the "add new collection partner" mutation
  const [addCollectionPartner] = useCreateCollectionPartnerMutation();

  /**
   * Collect form data and send it to the API
   */
  const handleSubmit = (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>,
  ): void => {
    addCollectionPartner({
      variables: {
        name: values.name,
        url: values.url,
        blurb: values.blurb,
        // Images are added separately, on the individual Partner pages
        imageUrl: '',
      },
      refetchQueries: [
        // make sure the Partners page is updated when we add a new partner
        {
          query: GetCollectionPartnersDocument,
          variables: { perPage: config.pagination.partnersPerPage },
        },
      ],
    })
      .then(({ data }) => {
        // Success! Move on to the author page to be able to upload a photo, etc.
        history.push(
          `/collections/partners/${data?.createCollectionPartner?.externalId}/`,
          {
            partner: data?.createCollectionPartner,
          },
        );
      })
      .catch((error: Error) => {
        showNotification(error.message, 'error');
        formikHelpers.setSubmitting(false);
      });
  };

  return (
    <>
      <Box mb={3}>
        <h1>Add a Partner</h1>
        <p>You will be able to add an image on the next page.</p>
      </Box>
      <Paper elevation={4}>
        <Box p={2} mt={3}>
          <PartnerForm
            partner={partner}
            onSubmit={handleSubmit}
            editMode={false}
          />
        </Box>
      </Paper>
    </>
  );
};
