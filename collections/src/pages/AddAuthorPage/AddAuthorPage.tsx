import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Paper } from '@material-ui/core';
import { FormikValues } from 'formik';
import { AuthorModel, useCreateCollectionAuthorMutation } from '../../api';
import { AuthorForm, Notification } from '../../components';

export const AddAuthorPage: React.FC = (): JSX.Element => {
  // These are used to display or hide notifications with messages from the API
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);

  // This is used to redirect the user to the full author page once
  // the record is added successfully
  const history = useHistory();

  // Provide a default author object for the form
  const author: AuthorModel = {
    externalId: '',
    name: '',
    slug: '',
    bio: '',
    imageUrl: '',
    active: true,
  };

  // prepare the "add new author" mutation
  // has to be done at the top level of the component because it's a hook
  const [addAuthor] = useCreateCollectionAuthorMutation();

  /**
   * Show a notification to the user whether the action (such as saving a record)
   * has completed successfully.
   */
  const showNotification = (message: string, isError: boolean) => {
    setHasError(isError);
    setMessage(message);
    setOpen(true);
  };

  /**
   * Close the toast notification
   */
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  /**
   * Collect form data and send it to the API
   */
  const handleSubmit = (values: FormikValues): void => {
    addAuthor({
      variables: {
        name: values.name,
        slug: values.slug,
        bio: values.bio,
        // Note that we're not yet sending the 'active' value on creating
        // a collection author, but we should!
        //active: values.active
      },
    })
      .then(({ data }) => {
        // Success! Move on to the author page to be able to upload a photo, etc.
        history.push(`/authors/${data?.createCollectionAuthor?.externalId}/`, {
          author: data?.createCollectionAuthor,
        });
      })
      .catch((error: Error) => {
        showNotification(error.message, true);
      });
  };

  return (
    <>
      <Box mb={3}>
        <h1>Add an Author</h1>
        <p>You will be able to add a photo on the next page.</p>
      </Box>
      <Paper elevation={4}>
        <Box p={2} mt={3}>
          <AuthorForm
            author={author}
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
