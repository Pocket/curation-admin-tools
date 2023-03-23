import React from 'react';
import { ShareableListModal, ShareableListsSearchForm } from '../../components';
import {
  // ShareableList,
  useSearchShareableListLazyQuery,
} from '../../../api/generatedTypes';
import { FormikValues } from 'formik';
import { Box, Paper } from '@mui/material';
import { Button, HandleApiResponse } from '../../../_shared/components';
import { useToggle } from '../../../_shared/hooks';

/**
 * Shareable lists lookup page
 */
export const SearchShareableListsPage = (): JSX.Element => {
  const [shareableListModalOpen, toggleLabelModal] = useToggle(false);
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
            // data.searchShareableLists.map((list: ShareableList) => {

            <ShareableListModal
              key={data.searchShareableList.externalId}
              isOpen={shareableListModalOpen}
              toggleModal={toggleLabelModal}
              modalTitle="Moderate List"
              refetch={refetch}
              shareableList={data.searchShareableList}
              runModerateShareableListMutation={true} // this modal is in charge of creating a label, so passing flag
            >
              <Button buttonType="hollow" onClick={toggleLabelModal}>
                Add label
              </Button>{' '}
            </ShareableListModal>
          )}

          {/*          {data && data.searchShareableList && (
            // TODO: flesh out a component
            <h3>{data.searchShareableList.title}</h3>
          )}*/}
        </Box>
      </Paper>
    </>
  );
};
