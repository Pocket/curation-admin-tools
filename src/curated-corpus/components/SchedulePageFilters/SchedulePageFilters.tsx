import React, { ReactElement } from 'react';
import { Typography } from '@mui/material';

import { curationPalette } from '../../../theme';
import { ScheduleResultsFilter } from '../../components';
import {
  Maybe,
  ScheduledCorpusItem,
  ScheduledItemSource,
} from '../../../api/generatedTypes';
import { getDisplayTopic, getGroupedTopicData } from '../../helpers/topics';
import { getGroupedPublisherData } from '../../helpers/publishers';

export interface SchedulePageFiltersInterface {
  topics: string;
  publishers: string;
  types: string;
}

interface SchedulePageFiltersProps {
  /**
   * Scheduled items for a given date - to summarise in the filters
   */
  scheduledItems: ScheduledCorpusItem[];

  /**
   * Callback to set filters on the Schedule Page
   */
  setFilters: React.Dispatch<
    React.SetStateAction<SchedulePageFiltersInterface>
  >;
}

/**
 * Populate and display filter dropdowns on the Schedule page.
 *
 * @param props
 * @constructor
 */
export const SchedulePageFilters: React.FC<SchedulePageFiltersProps> = (
  props,
): ReactElement => {
  const { scheduledItems, setFilters } = props;

  // Extract all topics from scheduled item data
  const topics =
    scheduledItems.map(
      (item: { approvedItem: { topic: Maybe<string> | undefined } }) =>
        getDisplayTopic(item.approvedItem.topic),
    ) ?? [];

  const topicList = getGroupedTopicData(topics, true);

  // Extract all publishers from scheduled item data
  const publishers =
    scheduledItems.map(
      (item: { approvedItem: { publisher: string } }) =>
        item.approvedItem.publisher,
    ) ?? [];

  const publisherList = getGroupedPublisherData(publishers);

  // Round up all the different types of scheduled items we're interested in
  const typeList = [
    {
      name: 'ML',
      count: scheduledItems.filter(
        (item) => item.source === ScheduledItemSource.Ml,
      ).length,
    },
    {
      name: 'Syndicated',
      count: scheduledItems.filter((item) => item.approvedItem.isSyndicated)
        .length,
    },
    {
      name: 'Collections',
      count: scheduledItems.filter((item) => item.approvedItem.isCollection)
        .length,
    },
  ];

  return (
    <>
      <Typography sx={{ fontSize: '0.75rem', color: curationPalette.neutral }}>
        Filter by:
      </Typography>
      <ScheduleResultsFilter
        filterData={topicList}
        filterName="topics"
        itemCount={scheduledItems.length}
        setFilters={setFilters}
      />
      <ScheduleResultsFilter
        filterData={publisherList}
        filterName="publishers"
        itemCount={scheduledItems.length}
        setFilters={setFilters}
      />
      <ScheduleResultsFilter
        filterData={typeList}
        filterName="types"
        itemCount={scheduledItems.length}
        setFilters={setFilters}
      />
    </>
  );
};
