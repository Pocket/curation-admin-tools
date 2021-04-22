import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { AuthorModel, useGetAuthorById } from '../../api';
import {
  AuthorForm,
  AuthorInfo,
  Button,
  HandleApiResponse,
} from '../../components';
import { Box, Fade, Paper } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import { FormikValues } from 'formik';

interface AuthorPageProps {
  author?: AuthorModel;
}

export const AuthorPage = (): JSX.Element => {
  /**
   * If an Author object was passed to the page from one of the other app pages,
   * let's extract it from the routing.
   */
  const location = useLocation<AuthorPageProps>();
  let author: AuthorModel | undefined = location.state?.author;

  /**
   * If this page is being accessed directly, fetch the author info
   * from the the API.
   */
  const params = useParams<{ id: string }>();
  const { loading, error, data } = useGetAuthorById(
    {
      id: params.id,
    },
    // Skip query if author object was delivered via the routing
    typeof author === 'object'
  );

  if (data && data.getCollectionAuthor) {
    author = data.getCollectionAuthor;
  }

  const [showEditForm, setShowEditForm] = useState<boolean>(false);

  const toggleEditForm = (): void => {
    setShowEditForm(!showEditForm);
  };

  const handleSubmit = (values: FormikValues): void => {
    console.log(values);
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
                  handleCancel={toggleEditForm}
                />
              </Box>
            </Paper>
          </Fade>
        </>
      )}
      {/*<h2>Collections by this author</h2>*/}
    </>
  );
};
