import React from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Collapse,
  Grid,
  Paper,
  Typography,
} from '@material-ui/core';
import {
  CollectionPartnerAssociation,
  CollectionPartnershipType,
  Exact,
  GetCollectionPartnerAssociationDocument,
  GetCollectionPartnerAssociationQuery,
  useDeleteCollectionPartnerAssociationMutation,
  useGetCollectionPartnersQuery,
  useUpdateCollectionPartnerAssociationMutation,
} from '../../api/collection-api/generatedTypes';
import {
  CollectionPartnerAssociationForm,
  HandleApiResponse,
  ImageUpload,
} from '../';
import EditIcon from '@material-ui/icons/Edit';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import { useRunMutation, useToggle } from '../../hooks/';
import { ApolloQueryResult } from '@apollo/client';
import { FormikValues } from 'formik';
import { FormikHelpers } from 'formik/dist/types';

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
   *
   * The type is a little verbose and can be undefined
   * as it comes from a useLazyQuery() hook instead of useQuery()
   */
  refetch:
    | ((
        variables?: Partial<Exact<{ externalId: string }>> | undefined
      ) => Promise<ApolloQueryResult<GetCollectionPartnerAssociationQuery>>)
    | undefined;
}

/**
 * A simple component that shows collection-partner association information.
 *
 * @param props
 * @constructor
 */
export const CollectionPartnerAssociationInfo: React.FC<AssociationPreviewProps> =
  (props): JSX.Element => {
    const { association } = props;
    const [showEditForm, toggleEditForm] = useToggle();

    // Get a helper function that will execute a mutation and show notifications
    const { runMutation } = useRunMutation();

    // Load the partners for the dropdown in the partnership form
    const { loading, error, data } = useGetCollectionPartnersQuery({
      variables: { perPage: 1000 },
    });

    // Prepare the "Delete association" mutate function
    const [deleteAssociation] = useDeleteCollectionPartnerAssociationMutation();

    // Delete the association when the user requests this action
    const onDelete = (): void => {
      runMutation(
        association,
        deleteAssociation,
        {
          variables: {
            externalId: association.externalId,
          },
        },
        'Partnership deleted successfully.'
      );
    };

    // prepare the "update association" mutation
    const [updateAssociation] = useUpdateCollectionPartnerAssociationMutation();

    // Update the association when the edit form is submitted
    const onUpdate = (
      values: FormikValues,
      formikHelpers: FormikHelpers<any>
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
        refetchQueries: [
          // make sure the Association component is refreshed when we update
          {
            query: GetCollectionPartnerAssociationDocument,
            variables: { externalId: association.externalId },
          },
        ],
      };

      runMutation(
        association,
        updateAssociation,
        options,
        'Partnership updated successfully.',
        () => {
          toggleEditForm();
          formikHelpers.setSubmitting(false);
        },
        () => {
          formikHelpers.setSubmitting(false);
        }
      );
    };

    return (
      <>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <ImageUpload
              entity={association.imageUrl ? association : association.partner}
              placeholder="/placeholders/collection.svg"
              onImageSave={() => {}}
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
              <Typography>
                {association.blurb ?? association.partner.blurb}
              </Typography>
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
                  {!data && (
                    <HandleApiResponse loading={loading} error={error} />
                  )}
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
