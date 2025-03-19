import React, { ReactElement } from 'react';
import { Grid } from '@mui/material';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import KeyboardDoubleArrowDownOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowDownOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import {
  ScheduledCorpusItem,
  ActivitySource,
} from '../../../api/generatedTypes';

import { StyledScheduledItemCard } from '../../../_shared/styled';
import { StoryItemListCard } from '../StoryItemListCard/StoryItemListCard';
import { CardAction, CardActionButtonRow } from '../../../_shared/components';

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
   * Callback for the "Reject" (trash) button
   */
  onReject: VoidFunction;

  /**
   * Current date that the schedule is being viewed for
   */
  currentScheduledDate: string;

  /**
   * The surface the card is displayed on, e.g. EN_US
   */
  scheduledSurfaceGuid: string;
}

export const ScheduledItemCardWrapper: React.FC<
  ScheduledItemCardWrapperProps
> = (props): ReactElement => {
  const {
    item,
    onMoveToBottom,
    onUnschedule,
    onReschedule,
    onEdit,
    onReject,
    currentScheduledDate,
    scheduledSurfaceGuid,
  } = props;

  // card action buttons to be rendered & aligned on bottom left
  const cardActionButtonsLeft: CardAction[] = [
    {
      actionName: 'Reject',
      icon: <DeleteOutlinedIcon />,
      onClick: () => onReject(),
    },
    {
      actionName: 'Move to bottom',
      icon: <KeyboardDoubleArrowDownOutlinedIcon />,
      onClick: () => onMoveToBottom(),
    },
    { actionName: 'Edit', icon: <EditOutlinedIcon />, onClick: () => onEdit() },
    {
      actionName: 'Re-schedule',
      icon: <ScheduleIcon />,
      onClick: () => onReschedule(),
    },
  ];

  // card action buttons to be rendered & aligned on bottom right
  const cardActionButtonsRight: CardAction[] = [
    {
      actionName: 'Unschedule',
      icon: <EventBusyOutlinedIcon />,
      onClick: () => onUnschedule(),
    },
  ];

  return (
    <Grid item xs={12} sm={6} md={3}>
      <StyledScheduledItemCard variant="outlined">
        <StoryItemListCard
          item={item.approvedItem}
          cardActionButtonRow={
            <CardActionButtonRow
              cardActionButtonsLeft={cardActionButtonsLeft}
              cardActionButtonsRight={cardActionButtonsRight}
            />
          }
          isMlScheduled={item.source === ActivitySource.Ml}
          currentScheduledDate={currentScheduledDate}
          scheduledSurfaceGuid={scheduledSurfaceGuid}
        />
      </StyledScheduledItemCard>
    </Grid>
  );
};
