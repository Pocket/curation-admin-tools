import React from 'react';
import { Box, CardContent, CardMedia, Link, Typography } from '@mui/material';

import { ApprovedCorpusItem } from '../../../api/generatedTypes';
import { flattenAuthors } from '../../../_shared/utils/flattenAuthors';
import { ScheduleHistory } from '..';

import { curationPalette } from '../../../theme';
import {
  CardActionButtonRow,
  CardImageOverlay,
} from '../../../_shared/components';

interface SuggestedScheduleItemListCardProps {
  /**
   * //TODO add comment
   */
  item: ApprovedCorpusItem;

  /**
   * What to do when the "Remove" button is clicked.
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
//TODO image overlay comp that shows topics and ML item overlay with tag and buttons

export const SuggestedScheduleItemListCard: React.FC<
  SuggestedScheduleItemListCardProps
> = (props): JSX.Element => {
  const { item, onRemove, onReschedule, onEdit } = props;

  //TODO move to helper
  // prefixing the item's imageUrl with the pocket-image-cache url to format it to a size of 600x300
  const getFormattedImageUrl = (imageUrl: string): string => {
    if (imageUrl && imageUrl.length > 0) {
      return `https://pocket-image-cache.com/600x300/filters:format(jpg):extract_focal()/`.concat(
        encodeURIComponent(imageUrl)
      );
    }
    return '/placeholders/collectionSmall.svg';
  };

  const showScheduleHistory = item.scheduledSurfaceHistory.length != 0;

  return (
    <>
      <CardMedia
        component="img"
        src={getFormattedImageUrl(item.imageUrl)}
        alt={item.title}
      />

      <CardImageOverlay item={item} />

      <CardContent
        sx={{
          padding: '0.5rem',
        }}
      >
        <Typography
          gutterBottom
          sx={{
            marginTop: '0.25rem',
            fontWeight: 400,
            fontSize: '0.875rem',
            color: curationPalette.neutral,
          }}
        >
          <span>{item.publisher}</span> &middot;{' '}
          <span>{flattenAuthors(item.authors)}</span>
        </Typography>
        <Typography
          variant="h5"
          align="left"
          gutterBottom
          sx={{
            fontSize: '1rem',
            fontWeight: 500,
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
        <Typography variant="body2" component="p" gutterBottom>
          {item.excerpt}
        </Typography>
      </CardContent>
      <CardContent>
        {showScheduleHistory && (
          <ScheduleHistory
            data={item.scheduledSurfaceHistory}
            isProspect={false}
          />
        )}
      </CardContent>

      {/* Push the rest of the elements to the bottom of the card. */}
      <Box sx={{ flexGrow: 1 }} />

      <CardContent>
        <CardActionButtonRow
          onEdit={onEdit}
          onRemove={onRemove}
          onReschedule={onReschedule}
        />
      </CardContent>
    </>
  );
};
