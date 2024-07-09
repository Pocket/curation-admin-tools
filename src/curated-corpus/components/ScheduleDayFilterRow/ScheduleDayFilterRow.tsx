import React, { ReactElement } from 'react';
import { Typography } from '@mui/material';

import { curationPalette } from '../../../theme';
import { ScheduleDayFilter } from '../../components';
import {
  Maybe,
  ScheduledCorpusItem,
  ScheduledItemSource,
} from '../../../api/generatedTypes';
import { getDisplayTopic, getGroupedTopicData } from '../../helpers/topics';
import { getGroupedPublisherData } from '../../helpers/publishers';

export interface ScheduleDayFilterOptions {
  topics: string;
  publishers: string;
  types: string;
}

interface ScheduleDayFilterRowProps {
  /**
   * Scheduled items for a given date - to summarise in the filters
   */
  scheduledItems: ScheduledCorpusItem[];

  /**
   * Callback to set filters on the Schedule Page
   */
  setFilters: React.Dispatch<React.SetStateAction<ScheduleDayFilterOptions>>;
}

/**
 * Populate and display filter dropdowns on the Schedule page.
 *
 * @param props
 * @constructor
 */
export const ScheduleDayFilterRow: React.FC<ScheduleDayFilterRowProps> = (
  props,
): ReactElement => {
  const { scheduledItems, setFilters } = props;

  // Extract all topics from scheduled item data
  const topics =
    scheduledItems.map(
      (item: { approvedItem: { topic: Maybe<string> | undefined } }) =>
        getDisplayTopic(item.approvedItem.topic),
    ) ?? [];

  const topicList = getGroupedTopicData(topics, true, false);

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
      name: 'Ml',
      count: scheduledItems.filter(
        (item) => item.source === ScheduledItemSource.Ml,
      ).length,
    },
    {
      name: 'ML-Syndicated',
      count: scheduledItems.filter(
        (item) =>
          item.source === ScheduledItemSource.Ml &&
          item.approvedItem.isSyndicated,
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
      <ScheduleDayFilter
        filterData={topicList}
        filterName="topics"
        itemCount={scheduledItems.length}
        setFilters={setFilters}
      />
      <ScheduleDayFilter
        filterData={typeList}
        filterName="types"
        itemCount={scheduledItems.length}
        setFilters={setFilters}
      />
      <ScheduleDayFilter
        filterData={publisherList}
        filterName="publishers"
        itemCount={scheduledItems.length}
        setFilters={setFilters}
      />
    </>
  );
};
