import React from 'react';
import { Grid } from '@mui/material';
import { ScheduleSummaryCard } from '../';
import { getGroupedPublisherData } from '../../helpers/publishers';
import { getDisplayTopic, getGroupedTopicData } from '../../helpers/topics';
import { Maybe, ScheduledCorpusItem } from '../../../api/generatedTypes';

interface ScheduleSummaryLayoutProps {
  /**
   * Scheduled items for a given date - to summarize in the component below.
   */
  scheduledItems: ScheduledCorpusItem[];
}

/**
 * This component is responsible for taking a list of scheduled stories
 * for a given date + surface combination and transforming it into two
 * summarised, human-readable tables of data.
 *
 * @param props
 * @constructor
 */
export const ScheduleSummaryLayout: React.FC<ScheduleSummaryLayoutProps> = (
  props,
): JSX.Element => {
  const { scheduledItems } = props;

  // Extract all publishers from scheduled item data
  const publishers =
    scheduledItems.map(
      (item: { approvedItem: { publisher: string } }) =>
        item.approvedItem.publisher,
    ) ?? [];

  // Extract all topics from scheduled item data
  const topics =
    scheduledItems.map(
      (item: { approvedItem: { topic: Maybe<string> | undefined } }) =>
        getDisplayTopic(item.approvedItem.topic),
    ) ?? [];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        {publishers && (
          <ScheduleSummaryCard
            headingCopy="Publishers"
            items={getGroupedPublisherData(publishers)}
          />
        )}
      </Grid>
      <Grid item xs={12} md={6}>
        {topics && (
          <ScheduleSummaryCard
            headingCopy="Topics"
            items={getGroupedTopicData(topics)}
          />
        )}
      </Grid>
    </Grid>
  );
};
