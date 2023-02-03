import React from 'react';
import { Box } from '@mui/material';
import { Button, HandleApiResponse } from '../../../_shared/components';
import { useToggle } from '../../../_shared/hooks';
import { LabelModal, LabelListCard } from '../../components';
import { Label, useLabelsQuery } from '../../../api/generatedTypes';

/**
 * Label List Page
 */
export const LabelListPage = (): JSX.Element => {
  /**
   * Keeps track of whether the "Add Label/Edit Label" modal is open or not.
   */
  const [labelModalOpen, toggleLabelModal] = useToggle(false);
  const { loading, error, data, refetch } = useLabelsQuery({});
  return (
    <>
      <Box display="flex">
        <Box flexGrow={1} alignSelf="center">
          <h1>Labels</h1>
        </Box>
        <LabelModal
          isOpen={labelModalOpen}
          toggleModal={toggleLabelModal}
          modalTitle="Add a New Label"
          refetch={refetch}
          runCreateLabelMutation={true} // this modal is in charge of creating a label, so passing flag
        />

        <Button buttonType="hollow" onClick={toggleLabelModal}>
          Add label
        </Button>
      </Box>
      {!data && <HandleApiResponse loading={loading} error={error} />}

      {data &&
        data.labels.map((label: Label) => {
          return (
            <LabelListCard
              key={label.externalId}
              label={label}
              refetch={refetch}
            />
          );
        })}
    </>
  );
};
