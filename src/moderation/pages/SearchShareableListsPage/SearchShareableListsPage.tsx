import React from 'react';
import {
  ShareableListCard,
  ShareableListsSearchForm,
  // ShareableListModal,
} from '../../components';
import { useSearchShareableListLazyQuery } from '../../../api/generatedTypes';
import { FormikValues } from 'formik';
import { Box, Paper } from '@mui/material';
// import { useToggle } from '../../../_shared/hooks';
import { HandleApiResponse } from '../../../_shared/components';

/**
 * Shareable lists lookup page
 */
export const SearchShareableListsPage = (): JSX.Element => {
  // const [shareableListModalOpen, toggleShareableListModal] = useToggle(false);
  // prepare the query for executing in the handleSubmit callback below
  const [searchShareableLists, { loading, error, data, refetch }] =
    useSearchShareableListLazyQuery(
      // Make sure search results are never served from the cache.
      { fetchPolicy: 'no-cache' }
    );

  const handleSubmit = (values: FormikValues): void => {
    // execute the search
    searchShareableLists({
      variables: { externalId: values.externalId },
    });
  };

  return (
    <>
      <h2>Search Shareable Lists</h2>

      <ShareableListsSearchForm onSubmit={handleSubmit} />

      <Paper elevation={4}>
        <Box p={2} mt={3}>
          {!data && <HandleApiResponse loading={loading} error={error} />}

          {data && data.searchShareableList && (
            <ShareableListCard
              list={data.searchShareableList}
              refetch={refetch}
            />
          )}
        </Box>
      </Paper>
    </>
  );
};
