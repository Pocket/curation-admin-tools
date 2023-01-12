import React, { useState } from 'react';
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
  /**
   * Keeps track of label list state
   */
  const [labelsList, setLabelsList] = useState<Label[]>([]);
  const { loading, error, data } = useLabelsQuery({
    onCompleted: (data) => {
      // set the state to the returned label list
      setLabelsList(data.labels ?? []);
    },
  });
  return (
    <>
      <Box display="flex">
        <Box flexGrow={1} alignSelf="center">
          <h1>Labels</h1>
        </Box>
        <AddLabelModal
          isOpen={addLabelModalOpen}
          toggleModal={toggleAddLabelModal}
          setLabelsList={setLabelsList}
        />

        <Button buttonType="hollow" onClick={toggleAddLabelModal}>
          Add label
        </Button>
      </Box>
      {!data && <HandleApiResponse loading={loading} error={error} />}

      {labelsList.map((label: Label) => {
        return <LabelListCard key={label.externalId} label={label} />;
      })}
    </>
  );
};
