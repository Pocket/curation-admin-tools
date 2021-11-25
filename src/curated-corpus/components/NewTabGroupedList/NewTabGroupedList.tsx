import React from 'react';
import { DateTime } from 'luxon';
import { Typography } from '@material-ui/core';
import { MiniNewTabScheduleCard } from '../';
import { ScheduledCuratedCorpusItem } from '../../api/curated-corpus-api/generatedTypes';
import { useStyles } from './NewTabGroupedList.styles';

interface NewTabGroupedListProps {
  /**
   * The date the items in the list are scheduled for. Format: YYYY-MM-DD
   */
  scheduledDate: string;
  /**
   * Which heading/card component to use to display the list
   */
  isSidebar?: boolean;
  /**
   * A list of Scheduled items to display.
   */
  scheduledItems: ScheduledCuratedCorpusItem[];
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
  const { scheduledDate, isSidebar = false, scheduledItems } = props;

  const numberOfStories = scheduledItems.length;

  // TODO: update second option to full-page component when implementing
  //  the same list on the New Tab page
  const ScheduleCard = isSidebar
    ? MiniNewTabScheduleCard
    : MiniNewTabScheduleCard;

  // Determine how to show the date. For today and tomorrow, use relative terms
  const tomorrow = DateTime.local().plus({ days: 1 });
  const scheduledDateObj = DateTime.fromFormat(scheduledDate, 'yyyy-MM-dd');
  let displayDate: string | null;
  if (scheduledDateObj <= tomorrow) {
    displayDate = scheduledDateObj.toRelativeCalendar();
  } else {
    displayDate = scheduledDateObj
      .setLocale('en')
      .toLocaleString(DateTime.DATE_FULL);
  }
  // For beyond the next couple of days, use a standard date
  return (
    <>
      <Typography
        className={isSidebar ? classes.compact : classes.large}
        variant={isSidebar ? 'h4' : 'h2'}
      >
        {displayDate} ({numberOfStories}{' '}
        {numberOfStories === 1 ? 'story' : 'stories'})
      </Typography>
      {scheduledItems.map((item) => {
        return <ScheduleCard key={item.externalId} item={item} />;
      })}
    </>
  );
};
