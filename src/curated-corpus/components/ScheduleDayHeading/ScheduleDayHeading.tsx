import React, { ReactElement } from 'react';
import { Grid, Stack, Typography } from '@mui/material';
import { Button } from '../../../_shared/components';
import { SchedulePageFilters } from '../';
import AddIcon from '@mui/icons-material/Add';
import { curationPalette } from '../../../theme';
import { DateTime } from 'luxon';
import { ScheduledCorpusItem } from '../../../api/generatedTypes';

import { SchedulePageFiltersInterface } from '../SchedulePageFilters/SchedulePageFilters';

interface ScheduleDayHeadingProps {
  /**
   * Actions to run when users click on the "Add Item" button
   */
  onAddItem: (date: string) => void;

  /**
   * The date to show in the heading and use in pre-filling the
   * "Add item" form. Comes through in SQL date format (YYYY-MM-DD).
   */
  scheduledDate: string;

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
 * Show a full-width header before scheduled items for a date
 * that includes the date, the "Add item" button and available filters.
 *
 * @param props
 * @constructor
 */
export const ScheduleDayHeading: React.FC<ScheduleDayHeadingProps> = (
  props
): ReactElement => {
  const { onAddItem, scheduledDate, scheduledItems, setFilters } = props;

  return (
    <>
      <Grid
        container
        alignItems="center"
        columnSpacing={6}
        rowSpacing={3}
        justifyContent="space-between"
      >
        <Grid item xs={3}>
          <Typography
            sx={{
              fontSize: '1.25rem',
              fontWeight: 500,
              textTransform: 'capitalize',
              color: curationPalette.pocketBlack,
            }}
          >
            {DateTime.fromFormat(scheduledDate, 'yyyy-MM-dd')
              .setLocale('en')
              .toLocaleString(DateTime.DATE_FULL)}
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            spacing={2}
          >
            <SchedulePageFilters
              scheduledItems={scheduledItems}
              setFilters={setFilters}
            />

            <Button
              onClick={() => {
                onAddItem(scheduledDate);
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
