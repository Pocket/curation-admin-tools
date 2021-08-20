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
  AuthorForm,
  AuthorInfo,
  HandleApiResponse,
  ImageUpload,
  ScrollToTop,
} from '../../components';
import { useNotifications } from '../../hooks/';
import {
  CollectionAuthor,
  GetInitialCollectionFormDataDocument,
  useGetAuthorByIdQuery,
  useUpdateCollectionAuthorImageUrlMutation,
  useUpdateCollectionAuthorMutation,
} from '../../api/collection-api/generatedTypes';

interface AuthorPageProps {
  author?: CollectionAuthor;
}

export const AuthorPage = (): JSX.Element => {
  // Prepare state vars and helper methods for API notifications
  const { showNotification } = useNotifications();

  // prepare the "update author" mutation
  // has to be done at the top level of the component because it's a hook
  const [updateAuthor] = useUpdateCollectionAuthorMutation();

  // And this one is only used to set the image url once the we know the S3 link
  const [updateAuthorImageUrl] = useUpdateCollectionAuthorImageUrlMutation();

  /**
   * If an Author object was passed to the page from one of the other app pages,
   * let's extract it from the routing.
   */
  const location = useLocation<AuthorPageProps>();

  const [author, setAuthor] = useState<CollectionAuthor | undefined>(
    location.state?.author
      ? // Deep clone a read-only object that comes from the routing
        JSON.parse(JSON.stringify(location.state?.author))
      : undefined
  );

  /**
   * If the user came directly to this page (i.e., via a bookmarked page),
   * fetch the author info from the the API.
   */
  const params = useParams<{ id: string }>();
  const { loading, error, data } = useGetAuthorByIdQuery({
    variables: {
      id: params.id,
    },
    // Skip query if author object was delivered via the routing
    // This is needed because hooks can only be called at the top level
    // of the component.
    skip: typeof author === 'object',
  });

  if (data) {
    //Author is a read only object when returned from Apollo, if we want to
    // update it we have to stringify and then parse it
    setAuthor(JSON.parse(JSON.stringify(data.getCollectionAuthor)));
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
    updateAuthor({
      variables: {
        externalId: author!.externalId,
        name: values.name,
        slug: values.slug,
        bio: values.bio,
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
        showNotification('Author updated successfully!', 'success');

        if (author) {
          author.bio = data?.updateCollectionAuthor?.bio;
          author.name = data?.updateCollectionAuthor?.name!;
          author.active = data?.updateCollectionAuthor.active!;
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
    updateAuthorImageUrl({
      variables: {
        externalId: author!.externalId,
        imageUrl: url,
      },
    })
      .then(({ data }) => {
        if (author) {
          author.imageUrl = data?.updateCollectionAuthorImageUrl?.imageUrl;
          showNotification(`Image saved to "${author!.name}"`, 'success');
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
      {author && (
        <>
          <Box display="flex">
            <Box flexGrow={1} alignSelf="center" textOverflow="ellipsis">
              <h1>
                {author.name}
                <Typography variant="subtitle2" component="div">
                  Author
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
                entity={author}
                placeholder="/placeholders/author.svg"
                onImageSave={handleImageUploadSave}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              <AuthorInfo author={author} />
            </Grid>
          </Grid>

          <Collapse in={showEditForm}>
            <Paper elevation={4}>
              <Box p={2} mt={3}>
                <Box mb={2}>
                  <h3>Edit Author</h3>
                </Box>
                <AuthorForm
                  author={author}
                  onSubmit={handleSubmit}
                  editMode={true}
                  onCancel={toggleEditForm}
                />
              </Box>
            </Paper>
          </Collapse>
        </>
      )}
      {/*<h2>Collections by this author</h2>*/}
    </>
  );
};
