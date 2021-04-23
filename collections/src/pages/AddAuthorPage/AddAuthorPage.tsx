import React from 'react';
import { Box, Paper } from '@material-ui/core';
import { AuthorModel } from '../../api';
import { AuthorForm } from '../../components';
import { FormikValues } from 'formik';
import { createCollectionAuthor } from '../../api/generatedTypes';

export const AddAuthorPage: React.FC = (): JSX.Element => {
  const author: AuthorModel = {
    externalId: '',
    name: '',
    slug: '',
    bio: '',
    imageUrl: '',
    active: true,
  };

  const handleSubmit = (values: FormikValues): void => {
    console.log(values);
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
    </>
  );
};
