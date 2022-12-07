import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Paper } from '@mui/material';
import { FormikValues } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import { AuthorForm } from '../../components';
import { useNotifications } from '../../../_shared/hooks';
import {
  CollectionAuthor,
  GetInitialCollectionFormDataDocument,
  useCreateCollectionAuthorMutation,
} from '../../../api/generatedTypes';

export const AddAuthorPage: React.FC = (): JSX.Element => {
  // Prepare state vars and helper methods for API notifications
  const { showNotification } = useNotifications();

  // This is used to redirect the user to the full author page once
  // the record is added successfully
  const history = useHistory();

  // Provide a default author object for the form
  const author: CollectionAuthor = {
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
   * Collect form data and send it to the API
   */
  const handleSubmit = (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ): void => {
    addAuthor({
      variables: {
        name: values.name,
        slug: values.slug,
        bio: values.bio,
        imageUrl: '',
        active: values.active,
      },
      refetchQueries: [
        // The lookup query for collection form dropdowns needs a refresh.
        // Since it contains a call to `getCollectionAuthors`, we don't need to
        // refresh it separately.
        {
          query: GetInitialCollectionFormDataDocument,
        },
      ],
    })
      .then(({ data }) => {
        // Success! Move on to the author page to be able to upload a photo, etc.
        history.push(
          `/collections/authors/${data?.createCollectionAuthor?.externalId}/`,
          {
            author: data?.createCollectionAuthor,
          }
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
        <h1>Add an Author</h1>
        <p>You will be able to add a photo on the next page.</p>
      </Box>
      <Paper elevation={4}>
        <Box p={2} mt={3}>
          <AuthorForm
            author={author}
            onSubmit={handleSubmit}
            editMode={false}
          />
        </Box>
      </Paper>
    </>
  );
};
