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

interface AuthorPageProps {
  author?: AuthorModel;
}

export const AuthorPage = (): JSX.Element => {
  // prepare the "add new author" mutation
  // has to be done at the top level of the component because it's a hook
  const [updateAuthor] = useUpdateCollectionAuthorMutation();

  // These are used to display or hide notifications with messages from the API
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [hasError, setHasError] = useState<boolean>(false);

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
   * If an Author object was passed to the page from one of the other app pages,
   * let's extract it from the routing.
   */
  const location = useLocation<AuthorPageProps>();
  let author: AuthorModel | undefined = location.state?.author;

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

  if (data && data.getCollectionAuthor) {
    author = data.getCollectionAuthor;
  }

  const [showEditForm, setShowEditForm] = useState<boolean>(false);

  const toggleEditForm = (): void => {
    setShowEditForm(!showEditForm);
  };

  // TODO: figure out how typescript wants us to do this
  const externalId = author?.externalId || 'idk';

  const handleSubmit = (values: FormikValues): void => {
    updateAuthor({
      variables: {
        externalId: externalId,
        name: values.name,
        //slug: values.slug,
        bio: values.bio,
        // Note that we're not yet sending the 'active' value on creating
        // a collection author, but we should!
        active: values.active,
      },
    })
      .then(({ data }) => {
        showNotification('Author updated successfully!', false);

        if (author && data) {
          author.bio = data?.updateCollectionAuthor?.bio;
          author.name = data?.updateCollectionAuthor?.name || 'fix this';
          author.active = data?.updateCollectionAuthor?.active;
        }
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
