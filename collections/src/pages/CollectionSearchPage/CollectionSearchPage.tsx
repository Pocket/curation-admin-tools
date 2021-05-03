import { useState } from 'react';
import { Box, Paper } from '@material-ui/core';
import {
  CollectionListCard,
  HandleApiResponse,
  CollectionSearchForm,
  ScrollToTop,
} from '../../components';
import { useGetSearchCollectionsQuery } from '../../api';
import { CollectionStatus } from '../../api/generatedTypes';
import { FormikValues } from 'formik';

export const CollectionSearchPage = (): JSX.Element => {
  const [hasSearch, setHasSearch] = useState<boolean>(false);
  const [searchAuthor, setSearchAuthor] = useState<string | undefined>(
    undefined
  );
  const [searchStatus, setSearchStatus] = useState<
    CollectionStatus | undefined
  >(undefined);
  const [searchTitle, setSearchTitle] = useState<string | undefined>(undefined);

  const { loading, error, data } = useGetSearchCollectionsQuery({
    variables: {
      status: searchStatus,
      author: searchAuthor,
      title: searchTitle,
    },
    skip: !hasSearch, // these negative names - ugh
  });

  const triggerSearchQuery = (): void => {
    setHasSearch(true);
  };

  /**
   * Collect form data and send it to the API.
   * Update components on page if updates have been saved successfully
   */
  const handleSubmit = (values: FormikValues): void => {
    triggerSearchQuery();

    setSearchAuthor(values.author);
    setSearchTitle(values.title);

    // while author and title can be empty and not impact search, status *must*
    // be a valid CollectionStatus, so we need to check before setting
    if (values.status !== '') {
      setSearchStatus(values.status);
    }
  };

  return (
    <>
      <ScrollToTop />
      <Box display="flex">
        <h1>Search Collections</h1>
      </Box>

      <Box p={2} mt={3}>
        <CollectionSearchForm onSubmit={handleSubmit} />
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
