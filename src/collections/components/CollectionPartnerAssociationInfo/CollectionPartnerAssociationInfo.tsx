import React from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Collapse,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ReactMarkdown from 'react-markdown';
import { FormikValues } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import {
  CollectionPartnerAssociation,
  CollectionPartnershipType,
  useDeleteCollectionPartnerAssociationMutation,
  useGetCollectionPartnersQuery,
  useUpdateCollectionPartnerAssociationImageUrlMutation,
  useUpdateCollectionPartnerAssociationMutation,
} from '../../../api/generatedTypes';
import { HandleApiResponse } from '../../../_shared/components';
import { CollectionPartnerAssociationForm, ImageUpload } from '../';
import { useRunMutation, useToggle } from '../../../_shared/hooks';
import { config } from '../../../config';

interface AssociationPreviewProps {
  /**
   * An object with everything related to an association between
   * a collection and a partner.
   */
  association: CollectionPartnerAssociation;

  /**
   * A helper method that requests the partnership from the API
   * whenever the cache needs updating, i.e. on deleting or updating
   * the partnership.
   */
  refetch: () => void;
}

/**
 * A simple component that shows collection-partner association information.
 *
 * @param props
 * @constructor
 */
export const CollectionPartnerAssociationInfo: React.FC<
  AssociationPreviewProps
> = (props): JSX.Element => {
  const { association, refetch } = props;
  const [showEditForm, toggleEditForm] = useToggle();

  // Get a helper function that will execute a mutation and show notifications
  const { runMutation } = useRunMutation();

  // Load the partners for the dropdown in the partnership form
  const { loading, error, data } = useGetCollectionPartnersQuery({
    variables: { perPage: config.pagination.valuesPerDropdown },
  });

  // Prepare the "Delete association" mutate function
  const [deleteAssociation] = useDeleteCollectionPartnerAssociationMutation();

  // Delete the association when the user requests this action
  const onDelete = (): void => {
    runMutation(
      deleteAssociation,
      {
        variables: {
          externalId: association.externalId,
        },
      },
      'Partnership deleted successfully',
      undefined,
      undefined,
      refetch,
    );
  };

  // prepare the "update association" mutation
  const [updateAssociation] = useUpdateCollectionPartnerAssociationMutation();

  // Update the association when the edit form is submitted
  const onUpdate = (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>,
  ): void => {
    const options = {
      variables: {
        externalId: association.externalId,
        type: values.type,
        partnerExternalId: values.partnerExternalId,
        name: values.name ? values.name : null,
        url: values.url ? values.url : null,
        imageUrl: association.imageUrl, // we'll update it separately
        blurb: values.blurb ? values.blurb : null,
      },
    };

    runMutation(
      updateAssociation,
      options,
      'Partnership updated successfully',
      () => {
        toggleEditForm();
        formikHelpers.setSubmitting(false);
      },
      () => {
        formikHelpers.setSubmitting(false);
      },
      refetch,
    );
  };

  // prepare the "update story image url" mutation
  const [updateImageUrl] =
    useUpdateCollectionPartnerAssociationImageUrlMutation();

  /**
   * Save the S3 URL we get back from the API to the collection story record
   */
  const handleImageUploadSave = (url: string): void => {
    runMutation(
      updateImageUrl,
      {
        variables: {
          externalId: association.externalId,
          imageUrl: url,
        },
      },
      'Image saved successfully',
    );
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <ImageUpload
            entity={association.imageUrl ? association : association.partner}
            placeholder="/placeholders/collection.svg"
            onImageSave={handleImageUploadSave}
          />
        </Grid>
        <Grid item xs={7} sm={8}>
          <Typography variant="button">
            {association.type === CollectionPartnershipType.Partnered
              ? 'In partnership with '
              : 'Brought to you by '}
            <a href={association.url ?? association.partner.url}>
              {association.name ?? association.partner.name}
            </a>
          </Typography>
          <Box marginTop={2}>
            <ReactMarkdown>
              {association.blurb ?? association.partner.blurb}
            </ReactMarkdown>
          </Box>
        </Grid>
        <Grid item xs={1} sm={1}>
          <ButtonGroup orientation="vertical" variant="text" color="primary">
            <Button color="primary" onClick={toggleEditForm}>
              <EditIcon />
            </Button>
            <Button color="primary" onClick={onDelete}>
              <DeleteOutlineIcon />
            </Button>
          </ButtonGroup>
        </Grid>
      </Grid>
      <Collapse in={showEditForm}>
        <Paper elevation={4}>
          <Box p={2} mt={3}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <h3>Edit partnership</h3>
                {!data && <HandleApiResponse loading={loading} error={error} />}
                {data && (
                  <CollectionPartnerAssociationForm
                    association={association}
                    partners={data.getCollectionPartners.partners}
                    onCancel={toggleEditForm}
                    onSubmit={onUpdate}
                  />
                )}
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Collapse>
    </>
  );
};
