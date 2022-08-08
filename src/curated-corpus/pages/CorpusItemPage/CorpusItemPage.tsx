import React from 'react';
import { useParams } from 'react-router-dom';
import { useApprovedCorpusItemQuery } from '../../../api/generatedTypes';
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
  const { loading, error, data } = useApprovedCorpusItemQuery({
    variables: {
      externalId: params.id,
    },
  });

  console.log(loading, error, data);

  return (
    <>
      {!data && <HandleApiResponse loading={loading} error={error} />}
      {/* The API query returns null if there is no match. Let's cater for it */}
      {data && data.approvedCorpusItem === null && (
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
      {data && data.approvedCorpusItem !== null && (
        <Grid container spacing={3}>
          <Grid item xs={12} sm={8}>
            <Box display="flex">
              <Box flexGrow={1} alignSelf="center" textOverflow="ellipsis">
                <h1>
                  {data.approvedCorpusItem?.title}
                  <Typography variant="subtitle2" component="div">
                    Corpus Item
                  </Typography>
                </h1>
              </Box>
              <Box alignSelf="center">
                <ButtonGroup
                  orientation="vertical"
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
            </Box>

            <ApprovedItemInfo item={data.approvedCorpusItem!} />
          </Grid>

          <Grid item xs={12} sm={4}>
            <h4>Sidebar with scheduling history</h4>
            <ApprovedItemCurationHistory item={data.approvedCorpusItem!} />
          </Grid>
        </Grid>
      )}
    </>
  );
};
