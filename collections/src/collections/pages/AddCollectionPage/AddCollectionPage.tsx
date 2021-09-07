import React from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Paper } from '@material-ui/core';
import { FormikValues } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import { HandleApiResponse } from '../../../_shared/components';
import { CollectionForm } from '../../components';
import { useNotifications } from '../../../_shared/hooks';
import {
  Collection,
  CollectionStatus,
  GetCollectionsDocument,
  useCreateCollectionMutation,
  useGetInitialCollectionFormDataQuery,
} from '../../api/collection-api/generatedTypes';
import { config } from '../../config';

export const AddCollectionPage: React.FC = (): JSX.Element => {
  // Prepare state vars and helper methods for API notifications
  const { showNotification } = useNotifications();

  // This is used to redirect the user to the full collection page once
  // the record is added successfully
  const history = useHistory();

  // Provide a default collection object for the form
  const collection: Collection = {
    externalId: '',
    title: '',
    slug: '',
    excerpt: '',
    intro: '',
    imageUrl: '',
    language: 'en',
    status: CollectionStatus.Draft,
    authors: [],
    stories: [],
  };

  // Load data for all the dropdowns in the add collection form
  const { loading, error, data } = useGetInitialCollectionFormDataQuery({
    variables: { page: 1, perPage: config.pagination.valuesPerDropdown },
  });

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
        IABParentCategoryExternalId: values.IABParentCategoryExternalId,
        IABChildCategoryExternalId: values.IABChildCategoryExternalId,
        language: values.language,
      },
      // make sure the relevant Collections tab is updated
      // when we add a new collection
      refetchQueries: [
        {
          query: GetCollectionsDocument,
          variables: {
            page: 1,
            perPage: config.pagination.collectionsPerPage,
            status: CollectionStatus.Draft,
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
          {!data && <HandleApiResponse loading={loading} error={error} />}

          {data &&
            data.getCollectionAuthors &&
            data.getCurationCategories &&
            data.getIABCategories &&
            data.getLanguages && (
              <CollectionForm
                authors={data.getCollectionAuthors.authors}
                curationCategories={data.getCurationCategories}
                iabCategories={data.getIABCategories}
                languages={data.getLanguages}
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
