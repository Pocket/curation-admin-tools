import React from 'react';
import { useParams } from 'react-router-dom';
import { useApprovedCorpusItemByExternalIdQuery } from '../../../api/generatedTypes';
import { HandleApiResponse } from '../../../_shared/components';
import { Box, Button, ButtonGroup, Grid, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import {
  ApprovedItemCurationHistory,
  ApprovedItemInfo,
} from '../../components';

/**
 * This page displays all the details and schedule history of a single corpus item.
 *
 * @constructor
 */
export const CorpusItemPage: React.FC = (): JSX.Element => {
  // Retrieve the external ID for the corpus item from the URL
  const params = useParams<{ id: string }>();

  // Query the API for data
  const { loading, error, data } = useApprovedCorpusItemByExternalIdQuery({
    variables: {
      externalId: params.id,
    },
  });

  return (
    <>
      {!data && <HandleApiResponse loading={loading} error={error} />}
      {/* The API query returns null if there is no match. Let's cater for it */}
      {data && data.approvedCorpusItemByExternalId === null && (
        <>
          <h1>🤦&nbsp;Oh no!</h1>
          <Box my={3}>
            <Alert severity="info" variant="filled">
              A corpus item with ID of &quot;{params.id}&quot; could not be
              found.
            </Alert>
          </Box>
        </>
      )}
      {data && data.approvedCorpusItemByExternalId !== null && (
        <Grid container spacing={6}>
          <Grid item xs={12} sm={8}>
            <h1>
              {data.approvedCorpusItemByExternalId?.title}
              <Typography variant="subtitle2" component="div">
                Corpus Item
              </Typography>
            </h1>

            <ApprovedItemInfo item={data.approvedCorpusItemByExternalId!} />
          </Grid>

          <Grid item xs={12} sm={4}>
            <h2>Actions</h2>
            <Box alignSelf="center" marginBottom={3}>
              <ButtonGroup
                orientation="horizontal"
                color="primary"
                variant="text"
              >
                <Button
                  color="primary"
                  onClick={() => {
                    alert('Ability to schedule is coming soon!');
                  }}
                >
                  Schedule
                </Button>
                <Button
                  color="secondary"
                  onClick={() => {
                    alert('Ability to reject is coming soon!');
                  }}
                >
                  Reject
                </Button>
                <Button
                  color="primary"
                  onClick={() => {
                    alert('Ability to edit is coming soon!');
                  }}
                >
                  Edit
                </Button>
              </ButtonGroup>
            </Box>

            <ApprovedItemCurationHistory
              item={data.approvedCorpusItemByExternalId!}
            />
          </Grid>
        </Grid>
      )}
    </>
  );
};
