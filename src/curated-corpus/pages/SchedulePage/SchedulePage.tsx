import React, { useState } from 'react';
import { Box, Grid, Typography } from '@material-ui/core';
import {
  ScheduledCuratedCorpusItemsFilterInput,
  ScheduledCuratedCorpusItemsResult,
  useGetScheduledItemsQuery,
} from '../../api/curated-corpus-api/generatedTypes';
import { DateTime } from 'luxon';
import { HandleApiResponse } from '../../../_shared/components';
import { LoadExtraButton, NewTabGroupedList } from '../../components';
import { ApolloError } from '@apollo/client';
import { useNotifications } from '../../../_shared/hooks';

export const SchedulePage: React.FC = (): JSX.Element => {
  const { showNotification } = useNotifications();

  // TODO: remove hardcoded value when New Tab selector is added to the page
  const newTabGuid = 'EN_US';

  // set up initial start/end dates
  const [startDate, setStartDate] = useState<DateTime>(DateTime.local());
  const [endDate, setEndDate] = useState<DateTime>(
    DateTime.local().plus({ days: 1 })
  );

  // By default, load today and tomorrow's items that are already scheduled
  // for this New Tab
  const { loading, error, data, fetchMore } = useGetScheduledItemsQuery({
    notifyOnNetworkStatusChange: true,
    variables: {
      filters: {
        newTabGuid,
        startDate: startDate.toFormat('yyyy-MM-dd'),
        endDate: endDate.toFormat('yyyy-MM-dd'),
      },
    },
  });

  const loadMore = (direction: 'past' | 'future') => {
    // Load two more days' worth of data
    let filters: ScheduledCuratedCorpusItemsFilterInput;

    if (direction === 'past') {
      filters = {
        newTabGuid,
        startDate: startDate.minus({ days: 2 }).toFormat('yyyy-MM-dd'),
        endDate: endDate.toFormat('yyyy-MM-dd'),
      };
    } else {
      filters = {
        newTabGuid,
        startDate: startDate.toFormat('yyyy-MM-dd'),
        endDate: endDate.plus({ days: 2 }).toFormat('yyyy-MM-dd'),
      };
    }
    fetchMore({
      variables: filters,
    })
      .then(() => {
        if (direction === 'future') {
          setEndDate(endDate.plus({ days: 2 }));
        } else {
          setStartDate(startDate.minus({ days: 2 }));
        }
      })
      .catch((error: ApolloError) => {
        // Show an error in a toast message, if any
        showNotification(error.message, 'error');
      });
  };

  return (
    <>
      <h1>Schedule</h1>
      <Box mb={3}>
        <Typography>
          I am curating for <strong>{newTabGuid}</strong> (temporarily
          hardcoded)
        </Typography>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          {!data && <HandleApiResponse loading={loading} error={error} />}

          {data && (
            <LoadExtraButton
              arrowDirection="up"
              label="Load Previous"
              onClick={() => {
                loadMore('past');
              }}
            />
          )}

          {data &&
            data.getScheduledCuratedCorpusItems.map(
              (data: ScheduledCuratedCorpusItemsResult) => (
                <Grid
                  container
                  direction="row"
                  alignItems="stretch"
                  justifyContent="flex-start"
                  spacing={3}
                  key={data.scheduledDate}
                >
                  <NewTabGroupedList key={data.scheduledDate} data={data} />
                </Grid>
              )
            )}

          {data && (
            <LoadExtraButton
              arrowDirection="down"
              label="Load Next"
              onClick={() => {
                loadMore('future');
              }}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
};
