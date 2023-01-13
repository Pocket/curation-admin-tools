import React from 'react';
import { Box } from '@mui/material';
import { Button, HandleApiResponse } from '../../../_shared/components';
import { useToggle } from '../../../_shared/hooks';
import { AddLabelModal, LabelListCard } from '../../components';
import { Label, useLabelsQuery } from '../../../api/generatedTypes';

/**
 * Label List Page
 */
export const LabelListPage = (): JSX.Element => {
  /**
   * Keeps track of whether the "Add Label" modal is open or not.
   */
  const [addLabelModalOpen, toggleAddLabelModal] = useToggle(false);
  const { loading, error, data, refetch } = useLabelsQuery({});
  return (
    <>
      <Box display="flex">
        <Box flexGrow={1} alignSelf="center">
          <h1>Labels</h1>
        </Box>
        <AddLabelModal
          isOpen={addLabelModalOpen}
          toggleModal={toggleAddLabelModal}
          refetch={refetch}
        />

        <Button buttonType="hollow" onClick={toggleAddLabelModal}>
          Add label
        </Button>
      </Box>
      {!data && <HandleApiResponse loading={loading} error={error} />}

      {data &&
        data.labels.map((label: Label) => {
          return <LabelListCard key={label.externalId} label={label} />;
        })}
    </>
  );
};
