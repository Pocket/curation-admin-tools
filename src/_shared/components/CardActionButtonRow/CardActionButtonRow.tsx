import React from 'react';
import { IconButton } from '@mui/material';
import { Stack } from '@mui/system';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

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
}

export const CardActionButtonRow: React.FC<CardActionButtonRowProps> = (
  props
): JSX.Element => {
  const { onEdit, onRemove, onReschedule } = props;

  return (
    <Stack direction="row" justifyContent="flex-end">
      <IconButton aria-label="remove" onClick={onRemove}>
        <DeleteOutlineIcon />
      </IconButton>
      <IconButton aria-label="re-schedule" onClick={onReschedule}>
        <ScheduleIcon />
      </IconButton>
      <IconButton aria-label="edit" onClick={onEdit}>
        <EditOutlinedIcon />
      </IconButton>
    </Stack>
  );
};
