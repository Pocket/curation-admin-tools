import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { Typography } from '@mui/material';

import {
  ScheduledCorpusItem,
  useGetScheduledItemsQuery,
} from '../../../api/generatedTypes';
import { HandleApiResponse } from '../../../_shared/components';
import { ScheduleSummaryLayout } from '../../components';

interface ScheduleSummaryConnectorProps {
  /**
   * The date the data should be fetched for. In Luxon's DateTime format
   */
  date: DateTime;

  /**
   * The scheduled surface GUID the data should be fetched for.
   */
  scheduledSurfaceGuid: string;

  /**
   * Whether to refresh the data - a manual trigger to refresh it
   * if an action happens upstream in a parent component.
   */
  refreshData: boolean;

  /**
   * A method to set the manual trigger above back to `false`
   * so it works on the next manual refresh (when it will be turned to `true`
   * again).
   *
   * @param refreshData
   */
  setRefreshData: (refreshData: boolean) => void;
}

/**
 * This component fetches summary data for a given date + scheduled surface
 * combination.
 *
 * Currently, it groups the stories by topic and publisher - sorted by frequency
 * in descending order.
 *
 * It displays all topics, including the ones none of the scheduled stories
 * belong to. It groups and displays only those publishers that are associated
 * with the scheduled stories.
 *
 * @param props
 * @constructor
 */
export const ScheduleSummaryConnector: React.FC<
  ScheduleSummaryConnectorProps
> = (props): JSX.Element => {
  const { date, scheduledSurfaceGuid, refreshData, setRefreshData } = props;

  const [scheduledItems, setScheduledItems] = useState<ScheduledCorpusItem[]>(
    []
  );

  // Get the stories already scheduled for a given date+surface combination.
  const { loading, error, data, refetch } = useGetScheduledItemsQuery({
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    variables: {
      filters: {
        scheduledSurfaceGuid,
        startDate: date.toFormat('yyyy-MM-dd'),
        endDate: date.toFormat('yyyy-MM-dd'),
      },
    },
    onCompleted: (data) => {
      // Save the scheduled items in a state var to be passed
      // on to the layout component to prep for display.
      //
      // Note that if there's nothing scheduled for a particular day,
      // `items` in the query result will be undefined, which is why
      // we fall back to an empty array just in case.
      setScheduledItems(data.getScheduledCorpusItems[0]?.items ?? []);
    },
  });

  /**
   * A new query to the API to fetch fresh data will be made
   * whenever the date or scheduled surface is updated.
   *
   * Additionally, a manual flag can be passed in to trigger
   * a refresh if required - for example, if a prospect is
   * scheduled for the date selected - it should be included
   * in the grouped data on the sidebar straight away.
   */
  useEffect(() => {
    refetch();

    if (refreshData) {
      setRefreshData(false);
    }
  }, [refreshData, date, scheduledSurfaceGuid]);

  // Finally, let's render everything onto the screen.
  return (
    <>
      {!data && <HandleApiResponse loading={loading} error={error} />}
      {data &&
        (data.getScheduledCorpusItems.length < 1 ||
          scheduledItems.length < 1) && (
          <Typography
            variant="h4"
            sx={{ fontSize: '1rem', fontWeight: 500, padding: '0.75rem 0' }}
          >
            No stories have been scheduled for this date yet.
          </Typography>
        )}
      {data && scheduledItems.length > 0 && (
        <>
          <Typography
            variant="h4"
            sx={{
              fontSize: '1rem',
              fontWeight: 500,
              padding: '0.75rem 0',
            }}
          >
            {data.getScheduledCorpusItems[0]?.totalCount}{' '}
            {data.getScheduledCorpusItems[0]?.totalCount === 1
              ? 'story'
              : 'stories'}
            , {data.getScheduledCorpusItems[0]?.syndicatedCount} syndicated
          </Typography>

          <ScheduleSummaryLayout scheduledItems={scheduledItems} />
        </>
      )}
    </>
  );
};
