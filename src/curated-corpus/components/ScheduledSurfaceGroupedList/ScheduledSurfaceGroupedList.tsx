import React from 'react';
import { DateTime } from 'luxon';
import { Grid, Typography } from '@material-ui/core';
import { MiniScheduleCard } from '../';
import {
  ScheduledCorpusItem,
  ScheduledCorpusItemsResult,
} from '../../../api/generatedTypes';
import { useStyles } from './ScheduledSurfaceGroupedList.styles';

interface ScheduledSurfaceGroupedListProps {
  /**
   * A list of Scheduled items to display with accompanying data
   * such as the scheduled date.
   */
  data: ScheduledCorpusItemsResult;
}

/**
 * This component renders a heading with a human-readable date
 * and a list of items scheduled for a scheduled surface for that day.
 *
 * @param props
 * @constructor
 */
export const ScheduledSurfaceGroupedList: React.FC<
  ScheduledSurfaceGroupedListProps
> = (props): JSX.Element => {
  const classes = useStyles();
  const { data } = props;

  const displayDate = DateTime.fromFormat(data.scheduledDate, 'yyyy-MM-dd')
    .setLocale('en')
    .toLocaleString(DateTime.DATE_FULL);

  return (
    <>
      <Grid item xs={12}>
        <Typography className={classes.heading} variant="h4">
          {displayDate} ({data.syndicatedCount}/{data.totalCount} syndicated)
        </Typography>
      </Grid>
      {data.items.map((item: ScheduledCorpusItem) => {
        return <MiniScheduleCard key={item.externalId} item={item} />;
      })}
    </>
  );
};
