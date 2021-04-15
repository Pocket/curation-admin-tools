import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { AuthorModel, useGetAuthorById } from '../../api';
import {
  AuthorInfo,
  Button,
  // AuthorForm,
  HandleApiResponse,
} from '../../components';
import { Box } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

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

  if (data && data[0]) {
    author = data[0];
  }

  const switchToEditForm = () => {
    console.log('The great transition happens here');
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
              <Button buttonType="hollow" onClick={switchToEditForm}>
                <EditIcon />
              </Button>
            </Box>
          </Box>
          <AuthorInfo author={author} />

          {/*<AuthorForm author={author} />*/}
        </>
      )}
      {/*<h2>Collections by this author</h2>*/}
    </>
  );
};
