import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Stack } from '@mui/system';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import KeyboardDoubleArrowDownOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowDownOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

// TODO: @Herraj -- See line 35 comment below
//import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

interface CardActionButtonRowProps {
  /**
   * Callback for the "Remove" button
   */
  onRemove: VoidFunction;

  /**
   * Callback for the "Reschedule" button
   */
  onReschedule: VoidFunction;

  /**
   * Callback for the "Edit" button
   */
  onEdit: VoidFunction;

  /**
   * Callback for the "Move to bottom" button
   */
  onMoveToBottom: VoidFunction;
}

export const CardActionButtonRow: React.FC<CardActionButtonRowProps> = (
  props
): JSX.Element => {
  const { onEdit, onRemove, onReschedule, onMoveToBottom } = props;

  return (
    <Stack direction="row" justifyContent="space-between">
      <Stack direction="row" justifyContent="flex-start">
        <Tooltip title="Reject" placement="bottom">
          {/** TODO: @Herraj -- enable when reject suggested item flow is ready */}
          <IconButton aria-label="remove" disabled>
            <DeleteOutlinedIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      <Stack direction="row" justifyContent="flex-start">
        <Tooltip title="Move to bottom" placement="bottom">
          <IconButton aria-label="move to bottom" onClick={onMoveToBottom}>
            <KeyboardDoubleArrowDownOutlinedIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Edit" placement="bottom">
          <IconButton aria-label="edit" onClick={onEdit}>
            <EditOutlinedIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Re-schedule" placement="bottom">
          <IconButton aria-label="re-schedule" onClick={onReschedule}>
            <ScheduleIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title="Remove" placement="bottom">
          <IconButton aria-label="remove" onClick={onRemove}>
            <EventBusyOutlinedIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  );
};
