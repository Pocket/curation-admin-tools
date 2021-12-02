import React from 'react';
import { ScheduledCuratedCorpusItem } from '../../api/curated-corpus-api/generatedTypes';
import { groupByObjectPropertyValue } from '../../../_shared/utils/groupByObjectPropertyValue';
import { NewTabGroupedList } from '../';

interface MiniNewTabScheduleGroupedListProps {
  scheduledItems: ScheduledCuratedCorpusItem[];
}

/**
 * This component renders lists of scheduled items with headings that correspond
 * to dates these items are scheduled for on a New Tab.
 *
 * @param props
 * @constructor
 */
export const MiniNewTabScheduleList: React.FC<
  MiniNewTabScheduleGroupedListProps
> = (props): JSX.Element => {
  const { scheduledItems } = props;

  const groupedByDate = groupByObjectPropertyValue(
    scheduledItems,
    'scheduledDate'
  );

  // This is decidedly not pretty, but we can't iterate over object props
  // within JSX.
  const lists: JSX.Element[] = [];
  for (const scheduledDate in groupedByDate) {
    lists.push(
      <NewTabGroupedList
        key={scheduledDate}
        scheduledDate={scheduledDate}
        scheduledItems={groupedByDate[scheduledDate]}
        isSidebar
      />
    );
  }

  return <>{lists}</>;
};
