import React, { ReactElement, useState } from 'react';
import { Box, CardContent, Link, Typography } from '@mui/material';

import { ApprovedCorpusItem } from '../../../api/generatedTypes';
import { flattenAuthors } from '../../../_shared/utils/flattenAuthors';

import { curationPalette } from '../../../theme';
import {
  CardActionButtonRow,
  CorpusItemCardImage,
} from '../../../_shared/components';
import { ScheduleHistoryModal } from '../ScheduleHistoryModal/ScheduleHistoryModal';

interface SuggestedScheduleItemListCardProps {
  /**
   * An approved corpus item object
   */
  item: ApprovedCorpusItem;

  /**
   * Current date that the schedule is being viewed for
   */
  currentScheduledDate: string;

  /**
   * The surface the card is displayed on, e.g. EN_US
   */
  scheduledSurfaceGuid: string;

  /**
   * Callback for the "Unschedule" button
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
   * Callback for the "Move to bottom" button
   */
  onMoveToBottom: VoidFunction;
}

export const SuggestedScheduleItemListCard: React.FC<
  SuggestedScheduleItemListCardProps
> = (props): ReactElement => {
  const {
    item,
    currentScheduledDate,
    scheduledSurfaceGuid,
    onUnschedule,
    onReschedule,
    onEdit,
    onMoveToBottom,
  } = props;

  const [isScheduleHistoryModalOpen, setScheduleHistoryModalOpen] =
    useState(false);

  const toggleScheduleHistoryModal = () => {
    setScheduleHistoryModalOpen(!isScheduleHistoryModalOpen);
  };

  return (
    <>
      <CorpusItemCardImage
        item={item}
        toggleScheduleHistoryModal={toggleScheduleHistoryModal}
        currentScheduledDate={currentScheduledDate}
        scheduledSurfaceGuid={scheduledSurfaceGuid}
      />
      {isScheduleHistoryModalOpen && (
        <ScheduleHistoryModal
          item={item}
          isOpen={isScheduleHistoryModalOpen}
          toggleModal={toggleScheduleHistoryModal}
        />
      )}

      <CardContent
        sx={{
          padding: '0.5rem',
          marginLeft: '0.5rem',
          marginRight: '0.5rem',
          marginBottom: '0.5rem',
        }}
      >
        <Typography
          gutterBottom
          sx={{
            marginTop: '0.25rem',
            fontWeight: 400,
            fontSize: '0.775rem',
            color: curationPalette.jetBlack,
            lineHeight: '1.1rem',
          }}
        >
          <span>{item.publisher}</span> &middot;{' '}
          <span>{flattenAuthors(item.authors)}</span>
          {/* <span>TODO add published date</span> */}
        </Typography>
        <Typography
          variant="h5"
          align="left"
          gutterBottom
          sx={{
            marginTop: '0.5rem',
            fontSize: '1.1rem',
            fontWeight: 500,
            lineHeight: '1.3rem',
          }}
        >
          <Link
            href={item.url}
            target="_blank"
            sx={{
              textDecoration: 'none',
              color: curationPalette.pocketBlack,
            }}
          >
            {item.title}
          </Link>
        </Typography>
        <Typography
          variant="body2"
          component="p"
          gutterBottom
          sx={{
            marginTop: '0.5rem',
            color: curationPalette.jetBlack,
            lineHeight: '1.1rem',
          }}
        >
          {item.excerpt}
        </Typography>
      </CardContent>

      {/* {TODO @Herraj rework this to use flex parents vs hacking it */}
      {/* Push the rest of the elements to the bottom of the card. */}
      <Box sx={{ flexGrow: 1 }} />

      <CardActionButtonRow
        onEdit={onEdit}
        onUnschedule={onUnschedule}
        onReschedule={onReschedule}
        onMoveToBottom={onMoveToBottom}
      />
    </>
  );
};
