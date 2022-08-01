import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { Grid, Typography } from '@material-ui/core';

import {
  GetScheduledItemsQuery,
  useGetScheduledItemsQuery,
} from '../../../api/generatedTypes';
import { HandleApiResponse } from '../../../_shared/components';
import { ScheduleSummary, ScheduleSummaryCard } from '../../components';
import { useStyles } from './ScheduleSummaryConnector.styles';
import { getDisplayTopic } from '../../helpers/helperFunctions';

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
      setPublishers(getGroupedPublisherData(data));
      setTopics(getGroupedTopicData(data));
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

  // Get data for publishers
  // TODO: move to a helper function file and add tests
  const getGroupedPublisherData = (
    data: GetScheduledItemsQuery
  ): ScheduleSummary[] => {
    const publishers: ScheduleSummary[] = [];

    data.getScheduledCorpusItems[0]?.items.forEach((item) => {
      const publisher = item.approvedItem.publisher;

      const existingEntry = publishers.find(
        (entry) => entry.name === publisher
      );

      existingEntry
        ? (existingEntry.count += 1)
        : publishers.push({ name: publisher, count: 1 });
    });

    // Sort publishers in descending order - most frequent on top
    publishers.sort(({ count: a }, { count: b }) => b - a);

    return publishers;
  };

  // Get data for topics
  // TODO: move to a helper function and add tests
  const getGroupedTopicData = (
    data: GetScheduledItemsQuery
  ): ScheduleSummary[] => {
    const topics: ScheduleSummary[] = [];

    data.getScheduledCorpusItems[0]?.items.forEach((item) => {
      const topic = getDisplayTopic(item.approvedItem.topic);

      const existingEntry = topics.find((entry) => entry.name === topic);

      existingEntry
        ? (existingEntry.count += 1)
        : topics.push({ name: topic, count: 1 });
    });

    // Sort topics in descending order - most frequent on top
    topics.sort(({ count: a }, { count: b }) => b - a);

    return topics;
  };

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
