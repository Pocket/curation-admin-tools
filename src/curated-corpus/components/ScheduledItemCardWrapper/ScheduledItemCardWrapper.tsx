import React from 'react';
import { Grid } from '@mui/material';
import { ScheduledCorpusItem } from '../../../api/generatedTypes';

import { StyledScheduledItemCard } from '../../../_shared/styled';
import { SuggestedScheduleItemListCard } from '../SuggestedScheduleItemListCard/SuggestedScheduleItemListCard';

interface ScheduledItemCardWrapperProps {
  /**
   * An object with everything scheduled curated item-related in it.
   */
  item: ScheduledCorpusItem;

  /**
   * Callback for the "Move to bottom" button
   */
  onMoveToBottom: VoidFunction;

  /**
   * What to do when the "Unschedule" button is clicked.
   */
  onUnschedule: VoidFunction;

  /**
   * Callback for the "Reschedule" button
   */
  onReschedule: VoidFunction;

  /**
   * Callback for the "Edit" button
   */
  onEdit: VoidFunction;

  /**
   * Current date that the schedule is being viewed for
   */
  currentScheduledDate: string;
}

export const ScheduledItemCardWrapper: React.FC<
  ScheduledItemCardWrapperProps
> = (props): JSX.Element => {
  const {
    item,
    onMoveToBottom,
    onUnschedule,
    onReschedule,
    onEdit,
    currentScheduledDate,
  } = props;

  return (
    <Grid item xs={12} sm={6} md={3}>
      <StyledScheduledItemCard variant="outlined">
        <SuggestedScheduleItemListCard
          item={item.approvedItem}
          currentScheduledDate={currentScheduledDate}
          onEdit={onEdit}
          onUnschedule={onUnschedule}
          onReschedule={onReschedule}
          onMoveToBottom={onMoveToBottom}
        />
      </StyledScheduledItemCard>
    </Grid>
  );
};
