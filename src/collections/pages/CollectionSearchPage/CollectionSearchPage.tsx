import React from 'react';
import { Box, Paper } from '@mui/material';
import { FormikValues } from 'formik';
import { HandleApiResponse, ScrollToTop } from '../../../_shared/components';
import { CollectionListCard, CollectionSearchForm } from '../../components';
import {
  Label,
  useLabelsQuery,
  useSearchCollectionsLazyQuery,
} from '../../../api/generatedTypes';

export const CollectionSearchPage: React.FC = (): JSX.Element => {
  // TODO: Get all available labels and pass them onto the form

  // prepare the query for executing in the handleSubmit callback below
  const [searchCollections, { loading, error, data }] =
    useSearchCollectionsLazyQuery(
      // We need to make sure search results are never served from the cache.
      // Otherwise this page is broken as we have a type policy on the
      // 'searchCollections' query.
      { fetchPolicy: 'no-cache' }
    );

  const { data: labelData } = useLabelsQuery();

  /**
   * Collect form data and send it to the API.
   * Update components on page if updates have been saved successfully
   */
  const handleSubmit = (values: FormikValues): void => {
    const searchVars: any = {
      author: values.author,
      title: values.title,
    };

    // author and title are strings and can be blank, but status must be a
    // CollectionStatus enum
    if (values.status !== '') {
      searchVars['status'] = values.status;
    }

    if (values.labels.length > 0) {
      searchVars['labelExternalIds'] = values.labels.map(
        (value: Label) => value.externalId
      );
    }

    // execute the search
    searchCollections({
      variables: { filters: searchVars },
    });
  };

  return (
    <>
      <ScrollToTop />
      <Box display="flex">
        <h1>Search Collections</h1>
      </Box>

      <Box p={2} mt={3}>
        {labelData && (
          <CollectionSearchForm
            labels={labelData.labels}
            onSubmit={handleSubmit}
          />
        )}
      </Box>

      <Paper elevation={4}>
        <Box p={2} mt={3}>
          {!data && <HandleApiResponse loading={loading} error={error} />}

          {data &&
            data.searchCollections &&
            !data.searchCollections.collections.length && (
              <div>No results!</div>
            )}

          {data &&
            data.searchCollections &&
            data.searchCollections.collections.map((collection) => {
              return (
                <CollectionListCard
                  key={collection.externalId}
                  collection={collection}
                />
              );
            })}
        </Box>
      </Paper>
    </>
  );
};
