import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { Grid, Typography } from '@material-ui/core';

import { useGetScheduledItemsQuery } from '../../../api/generatedTypes';
import { HandleApiResponse } from '../../../_shared/components';
import { ScheduleSummary, ScheduleSummaryCard } from '../../components';
import { useStyles } from './ScheduleSummaryConnector.styles';
import { getGroupedPublisherData } from '../../helpers/publishers';
import { getDisplayTopic, getGroupedTopicData } from '../../helpers/topics';

interface ScheduleSummaryCardConnectorProps {
  /**
   * The date the data should be fetched for. In YYYY-MM-DD format.
   */
  date: string;

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
  ScheduleSummaryCardConnectorProps
> = (props): JSX.Element => {
  const classes = useStyles();
  const { date, scheduledSurfaceGuid, refreshData, setRefreshData } = props;

  const [publishers, setPublishers] = useState<ScheduleSummary[] | null>(null);
  const [topics, setTopics] = useState<ScheduleSummary[] | null>(null);

  const displayDate = DateTime.fromFormat(date, 'yyyy-MM-dd')
    .setLocale('en')
    .toLocaleString(DateTime.DATE_FULL);

  // Get the stories already scheduled for a given date+surface combination.
  const { loading, error, data, refetch } = useGetScheduledItemsQuery({
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
    variables: {
      filters: {
        scheduledSurfaceGuid,
        startDate: date,
        endDate: date,
      },
    },
    onCompleted: (data) => {
      // Extract all publishers from scheduled item data
      const publishers =
        data.getScheduledCorpusItems[0]?.items.map(
          (item) => item.approvedItem.publisher
        ) ?? [];
      // Prep data for display
      setPublishers(getGroupedPublisherData(publishers));

      // Extract all topics from scheduled item data
      const topics =
        data.getScheduledCorpusItems[0]?.items.map((item) =>
          getDisplayTopic(item.approvedItem.topic)
        ) ?? [];
      // Prep data for display
      setTopics(getGroupedTopicData(topics));
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
    <div className={classes.root}>
      <h4>Scheduled for {displayDate}</h4>
      {!data && <HandleApiResponse loading={loading} error={error} />}
      {data && data.getScheduledCorpusItems[0]?.items.length < 1 && (
        <Typography className={classes.heading} variant="h4">
          No results
        </Typography>
      )}
      {data && data.getScheduledCorpusItems[0]?.items.length > 0 && (
        <>
          <Typography className={classes.heading} variant="h4">
            ({data.getScheduledCorpusItems[0]?.syndicatedCount}/
            {data.getScheduledCorpusItems[0]?.totalCount} syndicated)
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              {publishers && (
                <ScheduleSummaryCard
                  headingCopy="Publishers"
                  items={publishers}
                />
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              {topics && (
                <ScheduleSummaryCard headingCopy="Topics" items={topics} />
              )}
            </Grid>
          </Grid>
        </>
      )}
    </div>
  );
};
