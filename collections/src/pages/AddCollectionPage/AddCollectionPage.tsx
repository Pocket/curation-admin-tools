import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Paper } from '@material-ui/core';
import { FormikValues } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import {
  CollectionModel,
  CollectionStatus,
  useCreateCollectionMutation,
  useGetAuthorsQuery,
} from '../../api/collection-api';
import { CollectionForm, HandleApiResponse } from '../../components';
import { useNotifications } from '../../hooks/useNotifications';
import {
  GetDraftCollectionsDocument,
  useGetCurationCategoriesQuery,
} from '../../api/collection-api/generatedTypes';

export const AddCollectionPage: React.FC = (): JSX.Element => {
  // Prepare state vars and helper methods for API notifications
  const { showNotification } = useNotifications();

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
    authors: [],
  };

  // Load authors
  const { loading, error, data: authorsData } = useGetAuthorsQuery({
    variables: { page: 1, perPage: 1000 },
  });

  // load curation categories
  const {
    loading: curationCategoriesLoading,
    error: curationCategoriesError,
    data: curationCategoriesData,
  } = useGetCurationCategoriesQuery();

  // prepare the "add new collection" mutation
  // has to be done at the top level of the component because it's a hook
  const [addCollection] = useCreateCollectionMutation();

  /**
   * Collect form data and send it to the API
   */
  const handleSubmit = (
    values: FormikValues,
    formikHelpers: FormikHelpers<any>
  ): void => {
    addCollection({
      variables: {
        title: values.title,
        slug: values.slug,
        excerpt: values.excerpt,
        intro: values.intro,
        status: values.status,
        authorExternalId: values.authorExternalId,
        curationCategoryExternalId: values.curationCategoryExternalId,
      },
      // make sure the relevant Collections tab is updated
      // when we add a new collection
      refetchQueries: [
        {
          query: GetDraftCollectionsDocument,
          variables: {
            perPage: 50,
          },
        },
      ],
    })
      .then(({ data }) => {
        // Success! Move on to the author page to be able to upload a photo, etc.
        history.push(`/collections/${data?.createCollection?.externalId}/`, {
          collection: data?.createCollection,
        });
      })
      .catch((error: Error) => {
        showNotification(error.message, 'error');
        formikHelpers.setSubmitting(false);
      });
  };

  return (
    <>
      <Box mb={3}>
        <h1>Add a Collection</h1>
        <p>You will be able to add a hero image on the next page.</p>
      </Box>
      <Paper elevation={4}>
        <Box p={2} mt={3}>
          {!authorsData && (
            <HandleApiResponse loading={loading} error={error} />
          )}

          {!curationCategoriesData && (
            <HandleApiResponse
              loading={curationCategoriesLoading}
              error={curationCategoriesError}
            />
          )}

          {authorsData &&
            authorsData.getCollectionAuthors &&
            curationCategoriesData &&
            curationCategoriesData.getCurationCategories && (
              <CollectionForm
                authors={authorsData.getCollectionAuthors.authors}
                curationCategories={
                  curationCategoriesData.getCurationCategories
                }
                collection={collection}
                onSubmit={handleSubmit}
                editMode={false}
              />
            )}
        </Box>
      </Paper>
    </>
  );
};
