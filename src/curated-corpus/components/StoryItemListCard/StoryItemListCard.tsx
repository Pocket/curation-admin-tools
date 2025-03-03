import React, { ReactElement, useState } from 'react';
import { Box, CardContent, Link, Typography } from '@mui/material';
import { DateTime } from 'luxon';

import { ApprovedCorpusItem } from '../../../api/generatedTypes';
import { flattenAuthors } from '../../../_shared/utils/flattenAuthors';

import { curationPalette } from '../../../theme';
import { CorpusItemCardImage } from '../../../_shared/components';
import { ScheduleHistoryModal } from '../ScheduleHistoryModal/ScheduleHistoryModal';

interface StoryItemListCardProps {
  /**
   * An approved corpus item object
   */
  item: ApprovedCorpusItem;

  /**
   * CardActionButtonRow component
   */
  cardActionButtonRow: JSX.Element;

  /**
   * If this story item was sent by ML
   */
  isMlScheduled: boolean;

  /**
   * Current date that the schedule is being viewed for
   */
  currentScheduledDate?: string;

  /**
   * The surface the card is displayed on, e.g. EN_US
   */
  scheduledSurfaceGuid: string;
}

export const StoryItemListCard: React.FC<StoryItemListCardProps> = (
  props,
): ReactElement => {
  const {
    item,
    cardActionButtonRow,
    isMlScheduled,
    currentScheduledDate,
    scheduledSurfaceGuid,
  } = props;

  const [isScheduleHistoryModalOpen, setScheduleHistoryModalOpen] =
    useState(false);

  const toggleScheduleHistoryModal = () => {
    setScheduleHistoryModalOpen(!isScheduleHistoryModalOpen);
  };

  // Display the date this story was published on if it's avaiable
  const humanReadableDatePublished = item.datePublished
    ? DateTime.fromFormat(item.datePublished, 'yyyy-MM-dd')
        .setLocale('en')
        .toLocaleString(DateTime.DATE_FULL)
    : null;

  return (
    <>
      <CorpusItemCardImage
        item={item}
        toggleScheduleHistoryModal={toggleScheduleHistoryModal}
        currentScheduledDate={currentScheduledDate!}
        scheduledSurfaceGuid={scheduledSurfaceGuid}
        isMlScheduled={isMlScheduled}
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
          {item.datePublished && (
            <>
              {' '}
              &middot; <span>{humanReadableDatePublished}</span>
            </>
          )}
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

      <Box sx={{ flexGrow: 1 }} />
      {cardActionButtonRow}
    </>
  );
};
