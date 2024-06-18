import React, { ReactElement, useState } from 'react';
import { Box, Grid } from '@mui/material';
import {
  ScheduledCorpusItem,
  ScheduledCorpusItemsResult,
  ScheduledItemSource,
  useRescheduleScheduledCorpusItemMutation,
} from '../../../api/generatedTypes';
import {
  ScheduleDayFilterOptions,
  ScheduleDayHeading,
  ScheduledItemCardWrapper,
} from '../';

import { getDisplayTopic } from '../../helpers/topics';
import { useNotifications, useRunMutation } from '../../../_shared/hooks';

interface ScheduleDayDataProps {
  currentScheduledSurfaceGuid: string;

  /**
   * Data for a given date.
   */
  data: ScheduledCorpusItemsResult;

  /**
   * Actions to run when users click on the "Add Item" button
   */
  onAddItem: (date: string) => void;

  /**
   * A function that triggers a new API call to refetch the data for a given
   * query. Needed on the Schedule page to refresh data after every action.
   */
  refetch?: VoidFunction;

  setCurrentItem: React.Dispatch<
    React.SetStateAction<Omit<ScheduledCorpusItem, '__typename'> | undefined>
  >;

  toggleEditModal: VoidFunction;

  toggleRemoveModal: VoidFunction;

  toggleScheduleItemModal: VoidFunction;

  toggleRejectAndUnscheduleModal: VoidFunction;
}

/**
 * Show all scheduled entries for a given date.
 *
 * @param props
 * @constructor
 */
export const ScheduleDayData: React.FC<ScheduleDayDataProps> = (
  props,
): ReactElement => {
  const {
    currentScheduledSurfaceGuid,
    data,
    onAddItem,
    refetch,
    setCurrentItem,
    toggleEditModal,
    toggleRemoveModal,
    toggleScheduleItemModal,
    toggleRejectAndUnscheduleModal,
  } = props;

  // Set up the toast message hook
  const { showNotification } = useNotifications();

  // Get a helper function that will execute each mutation, show standard notifications
  // and execute any additional actions in a callback
  const { runMutation } = useRunMutation();

  // Prepare the "reschedule scheduled curated corpus item" mutation
  const [rescheduleItem] = useRescheduleScheduledCorpusItemMutation();

  /**
   * Pocket Hits items need to be returned in a pre-defined order. When the graph
   * is queried, scheduled items are returned sorted by the `updatedAt` value
   * in ascending order (most recently updated goes last).
   *
   * To enable the curators to rearrange stories in a certain order for a Pocket Hits
   * email, a "Move to bottom" button has been added that updates the scheduled entry
   * to bump up the timestamp recorded in the `updatedAt` field.
   * @param item
   */
  const moveItemToBottom = (item: ScheduledCorpusItem): void => {
    // Run the "reschedule" mutation with the same variables
    // it already has. All we want from it is to update `updatedAt` timestamp.
    const variables = {
      externalId: item.externalId,
      scheduledDate: item.scheduledDate,
      source: item.source,
    };

    // Run the mutation
    runMutation(
      rescheduleItem,
      { variables },
      `Success! Item moved to the bottom of the list.`,
      undefined,
      undefined,
      refetch,
    );
  };

  const initialFiltersState: ScheduleDayFilterOptions = {
    topics: 'All',
    publishers: 'All',
    types: 'All',
  };
  const [filters, setFilters] =
    useState<ScheduleDayFilterOptions>(initialFiltersState);

  return (
    <>
      <Box mt={9} mb={3}>
        <ScheduleDayHeading
          onAddItem={onAddItem}
          data={data}
          setFilters={setFilters}
          key={`{data.scheduledDate}-day-heading`}
        />
      </Box>

      <Grid
        container
        alignItems="stretch"
        spacing={3}
        justifyContent="flex-start"
        key={data.scheduledDate}
      >
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {data.items.map((item: ScheduledCorpusItem) => {
              if (
                (filters.topics === 'All' &&
                  filters.publishers === 'All' &&
                  filters.types === 'All') ||
                filters.topics === getDisplayTopic(item.approvedItem.topic) ||
                filters.publishers === item.approvedItem.publisher ||
                (filters.types === 'Ml' &&
                  item.source === ScheduledItemSource.Ml) ||
                (filters.types === 'Collections' &&
                  item.approvedItem.isCollection) ||
                (filters.types === 'Syndicated' &&
                  item.approvedItem.isSyndicated)
              ) {
                return (
                  <ScheduledItemCardWrapper
                    key={item.externalId}
                    item={item}
                    onEdit={() => {
                      setCurrentItem(item);
                      toggleEditModal();
                    }}
                    onUnschedule={() => {
                      setCurrentItem(item);
                      toggleRemoveModal();
                    }}
                    onMoveToBottom={() => {
                      moveItemToBottom(item);
                    }}
                    onReschedule={() => {
                      setCurrentItem(item);
                      toggleScheduleItemModal();
                    }}
                    onReject={() => {
                      setCurrentItem(item);

                      // If this item is also scheduled elsewhere, show an error.
                      if (
                        item.approvedItem.scheduledSurfaceHistory.length > 1
                      ) {
                        showNotification(
                          'Cannot reject and unschedule this item - multiple scheduled entries exist.',
                          'error',
                        );
                      }
                      // Otherwise, proceed with rejecting and unscheduling this item
                      else {
                        toggleRejectAndUnscheduleModal();
                      }
                    }}
                    currentScheduledDate={data.scheduledDate}
                    scheduledSurfaceGuid={currentScheduledSurfaceGuid}
                  />
                );
              }
            })}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};
