import React, { ReactElement } from 'react';
import { Grid, Stack, Typography } from '@mui/material';
import { Button } from '../../../_shared/components';
import { ScheduleDayFilterOptions, ScheduleDayFilterRow } from '../';
import AddIcon from '@mui/icons-material/Add';
import { curationPalette } from '../../../theme';
import { DateTime } from 'luxon';
import {
  ScheduledCorpusItemsResult,
  ScheduledItemSource,
} from '../../../api/generatedTypes';

interface ScheduleDayHeadingProps {
  /**
   * Actions to run when users click on the "Add Item" button
   */
  onAddItem: (date: string) => void;

  /**
   * Data for a given date.
   */
  data: ScheduledCorpusItemsResult;

  /**
   * Callback to set filters on the Schedule Page
   */
  setFilters: React.Dispatch<React.SetStateAction<ScheduleDayFilterOptions>>;
}

/**
 * Show a full-width header before scheduled items for a date
 * that includes the date, the "Add item" button and available filters.
 *
 * @param props
 * @constructor
 */
export const ScheduleDayHeading: React.FC<ScheduleDayHeadingProps> = (
  props,
): ReactElement => {
  const { onAddItem, data, setFilters } = props;

  // Figure out how many items are both ML-scheduled and Syndicated, since
  // it's not available from the graph as a ready-to-use data point
  const mlSyndicatedCount = data.items.filter(
    (item) =>
      item.source === ScheduledItemSource.Ml && item.approvedItem.isSyndicated,
  ).length;

  return (
    <>
      <Grid
        container
        alignItems="center"
        columnSpacing={6}
        rowSpacing={3}
        justifyContent="space-between"
      >
        <Grid item xs={12}>
          <Typography
            sx={{
              fontSize: '1.5rem',
              fontWeight: 500,
              textTransform: 'capitalize',
              color: curationPalette.pocketBlack,
            }}
          >
            {DateTime.fromFormat(data.scheduledDate, 'yyyy-MM-dd')
              .setLocale('en')
              .toLocaleString(DateTime.DATE_FULL)}{' '}
            {` (${mlSyndicatedCount} ML-syndicated, `}
            {`${data.syndicatedCount} syndicated, ${data.totalCount} total)`}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            spacing={2}
          >
            <ScheduleDayFilterRow
              scheduledItems={data.items}
              setFilters={setFilters}
            />

            <Button
              onClick={() => {
                onAddItem(data.scheduledDate);
              }}
            >
              <AddIcon />
              Add Item
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};
