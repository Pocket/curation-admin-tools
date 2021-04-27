import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Box, Fade, Paper } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { FormikValues } from 'formik';
import {
  AuthorForm,
  AuthorInfo,
  Button,
  HandleApiResponse,
  Notification,
} from '../../components';
import {
  AuthorModel,
  useGetAuthorByIdQuery,
  useUpdateCollectionAuthorMutation,
} from '../../api';
import { useNotifications } from '../../hooks/useNotifications';

interface AuthorPageProps {
  author?: AuthorModel;
}

export const AuthorPage = (): JSX.Element => {
  // Prepare state vars and helper methods for API notifications
  const {
    open,
    message,
    hasError,
    showNotification,
    handleClose,
  } = useNotifications();

  // prepare the "add new author" mutation
  // has to be done at the top level of the component because it's a hook
  const [updateAuthor] = useUpdateCollectionAuthorMutation();

  /**
   * If an Author object was passed to the page from one of the other app pages,
   * let's extract it from the routing.
   */
  const location = useLocation<AuthorPageProps>();
  let author: AuthorModel | undefined = location.state?.author
    ? // Deep clone a read-only object that comes from the routing
      JSON.parse(JSON.stringify(location.state?.author))
    : undefined;

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
    author = JSON.parse(JSON.stringify(data.getCollectionAuthor));
  }

  const [showEditForm, setShowEditForm] = useState<boolean>(false);

  const toggleEditForm = (): void => {
    setShowEditForm(!showEditForm);
  };

  /**
   * Collect form data and send it to the API.
   * Update components on page if updates have been saved successfully
   */
  const handleSubmit = (values: FormikValues): void => {
    updateAuthor({
      variables: {
        externalId: author!.externalId,
        name: values.name,
        slug: values.slug,
        bio: values.bio,
        active: values.active,
      },
    })
      .then(({ data }) => {
        showNotification('Author updated successfully!');

        if (author) {
          author.bio = data?.updateCollectionAuthor?.bio;
          author.name = data?.updateCollectionAuthor?.name!;
          author.active = data?.updateCollectionAuthor?.active;
        }
        toggleEditForm();
      })
      .catch((error: Error) => {
        showNotification(error.message, true);
      });
  };

  return (
    <>
      {!data && <HandleApiResponse loading={loading} error={error} />}
      {author && (
        <>
          <Box display="flex">
            <Box flexGrow={1} alignSelf="center" textOverflow="ellipsis">
              <h1>{author.name}</h1>
            </Box>
            <Box alignSelf="center">
              <Button buttonType="hollow" onClick={toggleEditForm}>
                <EditIcon />
              </Button>
            </Box>
          </Box>
          <AuthorInfo author={author} />

          <Fade in={showEditForm}>
            <Paper elevation={4}>
              <Box p={2} mt={3}>
                <AuthorForm
                  author={author}
                  onSubmit={handleSubmit}
                  showCancelButton={true}
                  onCancel={toggleEditForm}
                />
              </Box>
            </Paper>
          </Fade>
          <Notification
            handleClose={handleClose}
            isOpen={open}
            message={message}
            type={hasError ? 'error' : 'success'}
          />
        </>
      )}
      {/*<h2>Collections by this author</h2>*/}
    </>
  );
};
