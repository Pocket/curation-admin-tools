import React from 'react';
import { useGetProspectsQuery } from '../../api/prospect-api/generatedTypes';
import { HandleApiResponse } from '../../../_shared/components';
import { client } from '../../api/prospect-api/client';
import { ProspectListCard } from '../../components';
import { Box, Grid, Typography } from '@material-ui/core';

export const NewTabCurationPage: React.FC = (): JSX.Element => {
  const { loading, error, data } = useGetProspectsQuery(
    // We need to make sure search results are never served from the cache.
    {
      fetchPolicy: 'no-cache',
      notifyOnNetworkStatusChange: true,
      // TODO: remove hardcoded value when New Tab Selector is added to the page
      variables: { newTab: 'EN_US' },
      client,
    }
  );

  return (
    <>
      <h1>New Tab Curation</h1>
      <Box mb={3}>
        <Typography>
          I am curating for... <strong>EN-US</strong> (hardcoded, placeholder
          for controls TBA later)
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={9}>
          {!data && <HandleApiResponse loading={loading} error={error} />}

          {data &&
            data.getProspects.map((prospect) => {
              return <ProspectListCard key={prospect.id} prospect={prospect} />;
            })}
        </Grid>
        <Grid item xs={12} sm={3}>
          <h4>Scheduled for New Tab</h4>
        </Grid>
      </Grid>
    </>
  );
};
