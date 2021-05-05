import React, { useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Box, Collapse, Paper } from '@material-ui/core';
import {
  Button,
  CollectionForm,
  CollectionInfo,
  HandleApiResponse,
  Notification,
  ScrollToTop,
  StoryForm,
} from '../../components';
import {
  CollectionModel,
  StoryModel,
  useGetAuthorsQuery,
  useGetCollectionByIdQuery,
  useUpdateCollectionMutation,
} from '../../api';
import { useNotifications } from '../../hooks/useNotifications';
import { FormikValues } from 'formik';
import EditIcon from '@material-ui/icons/Edit';

interface CollectionPageProps {
  collection?: CollectionModel;
}

export const CollectionPage = (): JSX.Element => {
  // Prepare state vars and helper methods for API notifications
  const {
    open,
    message,
    hasError,
    showNotification,
    handleClose,
  } = useNotifications();

  // prepare the "upate collection" mutation
  // has to be done at the top level of the component because it's a hook
  const [updateCollection] = useUpdateCollectionMutation();

  /**
   * If a Collection object was passed to the page from one of the other app pages,
   * let's extract it from the routing.
   */
  const location = useLocation<CollectionPageProps>();
  let collection: CollectionModel | undefined = location.state?.collection
    ? // Deep clone a read-only object that comes from the routing
      JSON.parse(JSON.stringify(location.state?.collection))
    : undefined;

  /**
   * If the user came directly to this page (i.e., via a bookmarked page),
   * fetch the Collection info from the the API.
   */
  const params = useParams<{ id: string }>();
  const { loading, error, data } = useGetCollectionByIdQuery({
    variables: {
      id: params.id,
    },
    // Skip query if collection object was delivered via the routing
    // This is needed because hooks can only be called at the top level
    // of the component.
    skip: typeof collection === 'object',
  });

  if (data) {
    //Collection is a read only object when returned from Apollo, if we want to
    // update it we have to stringify and then parse it
    collection = JSON.parse(JSON.stringify(data.getCollection));
  }

  // Load authors for the dropdown in the edit form
  const {
    loading: authorsLoading,
    error: authorsError,
    data: authorsData,
  } = useGetAuthorsQuery();

  const [showEditForm, setShowEditForm] = useState<boolean>(false);

  const toggleEditForm = (): void => {
    setShowEditForm(!showEditForm);
  };

  /**
   * Collect form data and send it to the API.
   * Update components on page if updates have been saved successfully
   */
  const handleSubmit = (values: FormikValues): void => {
    updateCollection({
      variables: {
        id: collection!.externalId,
        title: values.title,
        slug: values.slug,
        excerpt: values.excerpt,
        intro: values.intro,
        status: values.status,
        authorExternalId: values.authorExternalId,
      },
    })
      .then(({ data }) => {
        showNotification('Collection updated successfully!');

        if (collection) {
          collection.title = data?.updateCollection?.title!;
          collection.slug = data?.updateCollection?.slug!;
          collection.excerpt = data?.updateCollection?.excerpt;
          collection.intro = data?.updateCollection?.intro;
          collection.status = data?.updateCollection?.status!;
          collection.authors = data?.updateCollection?.authors!;
        }
        toggleEditForm();
      })
      .catch((error: Error) => {
        showNotification(error.message, true);
      });
  };

  // provide an empty story object for the 'Add story' form
  const emptyStory: StoryModel = {
    externalId: '',
    url: '',
    title: '',
    excerpt: null,
    authors: [
      {
        name: '',
      },
    ],
    publisher: null,
    imageUrl: null,
  };

  return (
    <>
      <ScrollToTop />
      {!data && <HandleApiResponse loading={loading} error={error} />}
      {collection && (
        <>
          <Box display="flex">
            <Box flexGrow={1} alignSelf="center" textOverflow="ellipsis">
              <h1>{collection.title}</h1>
            </Box>
            <Box alignSelf="center">
              <Button buttonType="hollow" onClick={toggleEditForm}>
                <EditIcon />
              </Button>
            </Box>
          </Box>

          <CollectionInfo collection={collection} />

          <Collapse in={showEditForm}>
            <Paper elevation={4}>
              <Box p={2} mt={3}>
                {!authorsData && (
                  <HandleApiResponse
                    loading={authorsLoading}
                    error={authorsError}
                  />
                )}

                {authorsData && authorsData.getCollectionAuthors && (
                  <CollectionForm
                    authors={authorsData.getCollectionAuthors.authors}
                    collection={collection}
                    onSubmit={handleSubmit}
                    showCancelButton={true}
                  />
                )}
              </Box>
            </Paper>
          </Collapse>

          <Box mt={3}>
            <h2>Stories</h2>
            ...list of stories here
          </Box>

          <Box mt={3}>
            <h4>Add A Story</h4>
          </Box>
          <Paper elevation={4}>
            <Box p={2} mt={3}>
              <StoryForm
                onSubmit={() => {
                  console.log('Submitting the story...');
                }}
                story={emptyStory}
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
      )}
    </>
  );
};
