import React from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';
import { Button, HandleApiResponse } from '../../../_shared/components';
import { LabelListCard } from '../../components';
import { Label, useLabelsQuery } from '../../../api/generatedTypes';

/**
 * Label List Page
 */
export const LabelListPage = (): JSX.Element => {
  const { loading, error, data } = useLabelsQuery({});

  return (
    <>
      <Box display="flex">
        <Box flexGrow={1} alignSelf="center">
          <h1>Labels</h1>
        </Box>
        <Box alignSelf="center">
          <Button
            component={Link}
            to="/collections/labels/add/"
            buttonType="hollow"
          >
            Add label
          </Button>
        </Box>
      </Box>
      {!data && <HandleApiResponse loading={loading} error={error} />}

      {data &&
        data.labels.map((label: Label) => {
          return <LabelListCard key={label.externalId} label={label} />;
        })}
    </>
  );
};
