import React from 'react';
import { DateTime } from 'luxon';
import { Grid, Typography } from '@material-ui/core';
import { MiniNewTabScheduleCard } from '../';
import {
  ScheduledCuratedCorpusItem,
  ScheduledCuratedCorpusItemsResult,
} from '../../api/curated-corpus-api/generatedTypes';
import { useStyles } from './NewTabGroupedList.styles';

interface NewTabGroupedListProps {
  /**
   * A list of Scheduled items to display with accompanying data
   * such as the scheduled date.
   */
  data: ScheduledCuratedCorpusItemsResult;
}

/**
 * This component renders a heading with a human-readable date that is also
 * relative to today (e.g., "today", "tomorrow") and a list of items scheduled
 * for New Tab for that day.
 *
 * @param props
 * @constructor
 */
export const NewTabGroupedList: React.FC<NewTabGroupedListProps> = (
  props
): JSX.Element => {
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
      {data.items.map((item: ScheduledCuratedCorpusItem) => {
        return <MiniNewTabScheduleCard key={item.externalId} item={item} />;
      })}
    </>
  );
};
