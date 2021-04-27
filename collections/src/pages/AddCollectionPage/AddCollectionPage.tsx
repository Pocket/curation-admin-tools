import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Paper } from '@material-ui/core';
import { FormikValues } from 'formik';
import {
  CollectionModel,
  CollectionStatus,
  useCreateCollectionAuthorMutation,
} from '../../api';
import { CollectionForm, Notification } from '../../components';
import { useNotifications } from '../../hooks/useNotifications';

export const AddCollectionPage: React.FC = (): JSX.Element => {
  // Prepare state vars and helper methods for API notifications
  const {
    open,
    message,
    hasError,
    showNotification,
    handleClose,
  } = useNotifications();

  // This is used to redirect the user to the full collection page once
  // the record is added successfully
  const history = useHistory();

  // Provide a default collection object for the form
  const collection: CollectionModel = {
    externalId: '',
    title: '',
    slug: '',
    excerpt: '',
    intro: '',
    imageUrl: '',
    status: CollectionStatus.Draft,
  };

  // TODO: load a list of authors to use in the Authors select

  // prepare the "add new collection" mutation
  // has to be done at the top level of the component because it's a hook
  // TODO: add a `createCollection` mutation to src/api/mutations and generate types
  //const [addCollection] = useCreateCollectionMutation();

  /**
   * Collect form data and send it to the API
   */
  const handleSubmit = (values: FormikValues): void => {
    // TODO: use addCollection function to execute the mutation
    console.log(values);
  };

  return (
    <>
      <Box mb={3}>
        <h1>Add a Collection</h1>
        <p>You will be able to add a hero image on the next page.</p>
      </Box>
      <Paper elevation={4}>
        <Box p={2} mt={3}>
          <CollectionForm
            collection={collection}
            onSubmit={handleSubmit}
            showCancelButton={false}
          />
        </Box>
      </Paper>
      <Notification
        handleClose={handleClose}
        isOpen={open}
        message={message}
        type={hasError ? 'error' : 'success'}
      />
    </>
  );
};
