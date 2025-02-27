import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Stack } from '@mui/system';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import KeyboardDoubleArrowDownOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowDownOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import { curationPalette } from '../../../theme';

interface CardActionButtonRowProps {
  /**
   * Callback for the "Unschedule" button
   */
  onUnschedule?: VoidFunction;

  /**
   * Callback for the "Reschedule" button
   */
  onReschedule?: VoidFunction;

  /**
   * Callback for the "Edit" button
   */
  onEdit: VoidFunction;

  /**
   * Callback for the "Move to bottom" button
   */
  onMoveToBottom?: VoidFunction;

  /**
   * Callback for the "Reject" (trash) button
   */
  onReject?: VoidFunction;

  /**
   * Callback for the "Remove" (X) button
   */
  onRemove?: VoidFunction;
}

export const CardActionButtonRow: React.FC<CardActionButtonRowProps> = (
  props,
): JSX.Element => {
  const {
    onEdit,
    onUnschedule,
    onReschedule,
    onMoveToBottom,
    onReject,
    onRemove,
  } = props;

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      mb="0.5rem"
      mr="0.5rem"
      ml="0.5rem"
    >
      <Stack direction="row" justifyContent="flex-start">
        {onReject && (
          <Tooltip title="Reject" placement="bottom">
            <IconButton
              aria-label="reject"
              onClick={onReject}
              sx={{ color: curationPalette.jetBlack }}
            >
              <DeleteOutlinedIcon />
            </IconButton>
          </Tooltip>
        )}

        {onRemove && (
          <Tooltip title="Reject" placement="bottom">
            <IconButton
              aria-label="remove"
              onClick={onRemove}
              sx={{ color: curationPalette.jetBlack }}
            >
              <ClearIcon />
            </IconButton>
          </Tooltip>
        )}

        {onMoveToBottom && (
          <Tooltip title="Move to bottom" placement="bottom">
            <IconButton
              aria-label="move to bottom"
              onClick={onMoveToBottom}
              sx={{ color: curationPalette.jetBlack }}
            >
              <KeyboardDoubleArrowDownOutlinedIcon />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title="Edit" placement="bottom">
          <IconButton
            aria-label="edit"
            onClick={onEdit}
            sx={{ color: curationPalette.jetBlack }}
          >
            <EditOutlinedIcon />
          </IconButton>
        </Tooltip>

        {onReschedule && (
          <Tooltip title="Re-schedule" placement="bottom">
            <IconButton
              aria-label="re-schedule"
              onClick={onReschedule}
              sx={{ color: curationPalette.jetBlack }}
            >
              <ScheduleIcon />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      <Stack direction="row" justifyContent="flex-start">
        {onUnschedule && (
          <Tooltip title="Unschedule" placement="bottom">
            <IconButton
              aria-label="unschedule"
              onClick={onUnschedule}
              sx={{ color: curationPalette.jetBlack }}
            >
              <EventBusyOutlinedIcon />
            </IconButton>
          </Tooltip>
        )}
      </Stack>
    </Stack>
  );
};
