import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Collapse,
  Grid,
  Paper,
  Typography,
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { FormikValues } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import {
  HandleApiResponse,
  ImageUpload,
  PartnerForm,
  PartnerInfo,
  ScrollToTop,
} from '../../components';
import { useNotifications } from '../../hooks/';
import {
  CollectionPartner,
  GetCollectionPartnersDocument,
  useGetCollectionPartnerQuery,
  useUpdateCollectionPartnerImageUrlMutation,
  useUpdateCollectionPartnerMutation,
} from '../../api/collection-api/generatedTypes';
import { config } from '../../config';

interface PartnerPageProps {
  partner?: CollectionPartner;
}

export const PartnerPage = (): JSX.Element => {
  // Prepare state vars and helper methods for API notifications
  const { showNotification } = useNotifications();

  // prepare the "update author" mutation
  // has to be done at the top level of the component because it's a hook
  const [updateCollectionPartner] = useUpdateCollectionPartnerMutation();

  // And this one is only used to set the image url once the we know the S3 link
  const [updatePartnerImageUrl] = useUpdateCollectionPartnerImageUrlMutation();

  /**
   * If a Collection Partner object was passed to the page from one of the other app pages,
   * let's extract it from the routing.
   */
  const location = useLocation<PartnerPageProps>();

  const [partner, setPartner] = useState<CollectionPartner | undefined>(
    location.state?.partner
      ? // Deep clone a read-only object that comes from the routing
        JSON.parse(JSON.stringify(location.state?.partner))
      : undefined
  );

  /**
   * If the user came directly to this page (i.e., via a bookmarked page),
   * fetch the partner info from the the API.
   */
  const params = useParams<{ id: string }>();
  const { loading, error, data } = useGetCollectionPartnerQuery({
    variables: {
      id: params.id,
    },
    // Skip query if partner object was delivered via the routing
    // This is needed because hooks can only be called at the top level
    // of the component.
    skip: typeof partner === 'object',
  });

  if (data) {
    //Partner is a read only object when returned from Apollo, if we want to
    // update it we have to stringify and then parse it
    setPartner(JSON.parse(JSON.stringify(data.getCollectionPartner)));
  }

  const [showEditForm, setShowEditForm] = useState<boolean>(false);

  const toggleEditForm = (): void => {
    setShowEditForm(!showEditForm);
  };

  /**
   * Collect form data and send it to the API.
   * Update components on page if updates have been saved successfully
   */
  const handleSubmit = (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ): void => {
    updateCollectionPartner({
      variables: {
        externalId: partner!.externalId,
        name: values.name,
        url: values.url,
        blurb: values.blurb,
      },
      refetchQueries: [
        // make sure the Partners page is updated when we update a partner
        {
          query: GetCollectionPartnersDocument,
          variables: { perPage: config.pagination.collectionsPerPage },
        },
      ],
    })
      .then(({ data }) => {
        showNotification('Partner updated successfully!', 'success');

        if (partner) {
          partner.name = data?.updateCollectionPartner?.name!;
          partner.url = data?.updateCollectionPartner?.url!;
          partner.blurb = data?.updateCollectionPartner.blurb!;
        }
        toggleEditForm();
        formikHelpers.setSubmitting(false);
      })
      .catch((error: Error) => {
        showNotification(error.message, 'error');
        formikHelpers.setSubmitting(false);
      });
  };

  /**
   * Save the S3 URL we get back from the API to the author record
   */
  const handleImageUploadSave = (url: string): void => {
    updatePartnerImageUrl({
      variables: {
        externalId: partner!.externalId,
        imageUrl: url,
      },
      refetchQueries: [
        // make sure the Partners page is updated when we update a partner's image
        {
          query: GetCollectionPartnersDocument,
          variables: { perPage: config.pagination.partnersPerPage },
        },
      ],
    })
      .then(({ data }) => {
        if (partner) {
          partner.imageUrl = data?.updateCollectionPartnerImageUrl?.imageUrl;
          showNotification(`Image saved for "${partner!.name}"`, 'success');
        }
      })
      .catch((error: Error) => {
        showNotification(error.message, 'error');
      });
  };

  return (
    <>
      <ScrollToTop />
      {!data && <HandleApiResponse loading={loading} error={error} />}
      {partner && (
        <>
          <Box display="flex">
            <Box flexGrow={1} alignSelf="center" textOverflow="ellipsis">
              <h1>
                {partner.name}
                <Typography variant="subtitle2" component="div">
                  Partner
                </Typography>
              </h1>
            </Box>
            <Box alignSelf="center">
              <Button color="primary" onClick={toggleEditForm}>
                <EditIcon />
              </Button>
            </Box>
          </Box>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <ImageUpload
                entity={partner}
                placeholder="/placeholders/collection.svg"
                onImageSave={handleImageUploadSave}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <PartnerInfo partner={partner} />
            </Grid>
          </Grid>

          <Collapse in={showEditForm}>
            <Paper elevation={4}>
              <Box p={2} mt={3}>
                <Box mb={2}>
                  <h3>Edit Partner</h3>
                </Box>
                <PartnerForm
                  partner={partner}
                  onSubmit={handleSubmit}
                  editMode={true}
                  onCancel={toggleEditForm}
                />
              </Box>
            </Paper>
          </Collapse>
        </>
      )}
    </>
  );
};
