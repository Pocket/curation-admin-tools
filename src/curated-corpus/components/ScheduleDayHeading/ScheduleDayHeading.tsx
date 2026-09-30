import React, { ReactElement } from 'react';
import { Grid, Stack, Typography } from '@mui/material';
import { ScheduleDayFilterOptions, ScheduleDayFilterRow } from '../';
import { curationPalette } from '../../../theme';
import { DateTime } from 'luxon';
import { ScheduledCorpusItemsResult } from '../../../api/generatedTypes';

interface ScheduleDayHeadingProps {
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
 * that includes the date and available filters.
 *
 * @param props
 * @constructor
 */
export const ScheduleDayHeading: React.FC<ScheduleDayHeadingProps> = (
  props,
): ReactElement => {
  const { data, setFilters } = props;

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
              fontSize: '1.25rem',
              fontWeight: 500,
              textTransform: 'capitalize',
              color: curationPalette.pocketBlack,
            }}
          >
            {DateTime.fromFormat(data.scheduledDate, 'yyyy-MM-dd')
              .setLocale('en')
              .toLocaleString(DateTime.DATE_FULL)}{' '}
            {` (${data.syndicatedCount}/${data.totalCount} syndicated)`}
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
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};
