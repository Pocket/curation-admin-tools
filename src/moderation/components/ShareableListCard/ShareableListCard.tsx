import React from 'react';
import { Box, CardContent, Link, Typography } from '@mui/material';

import {
  ShareableListComplete,
  ShareableListStatus,
} from '../../../api/generatedTypes';
import { Chip } from '../../../_shared/components';
import { DateTime } from 'luxon';
import { StyledListCard } from '../../../_shared/styled';

interface ShareableListCardProps {
  /**
   * An object with everything shareable-list related in it.
   */
  list: ShareableListComplete;
}

// Exporting for unit testing
export const dateFormat = 'MMMM dd, yyyy HH:MM:ss';

export const ShareableListCard: React.FC<ShareableListCardProps> = (
  props
): JSX.Element => {
  const { list } = props;

  // This may be subject to change before the project goes live
  const fullUrlToList = `https://getpocket.com/sharedlists/${list.externalId}/${list.slug}/`;

  return (
    <StyledListCard>
      <CardContent
        sx={{
          padding: '0.5rem',
        }}
      >
        <Typography
          variant="h3"
          align="left"
          gutterBottom
          sx={{
            fontSize: '1.5rem',
            fontWeight: 500,
          }}
        >
          {list.title}
          <Chip label={list.status} color="primary" />
          <Chip label={list.moderationStatus} color="secondary" />
        </Typography>
        <Box sx={{ lineHeight: 2 }}>
          {list.status == ShareableListStatus.Public && (
            <Link
              href={fullUrlToList}
              target="_blank"
              sx={{
                textDecoration: 'none',
              }}
            >
              {fullUrlToList}
            </Link>
          )}
          {list.status == ShareableListStatus.Private && (
            <Box sx={{ lineHeight: 2 }}>
              <em>This list is private (no public link).</em>
            </Box>
          )}
        </Box>
        <Box sx={{ lineHeight: 2 }}>
          <strong>Description</strong>: {list.description}
        </Box>
        <Box sx={{ lineHeight: 2 }}>
          <strong>Created at</strong>:{' '}
          {DateTime.fromISO(list.createdAt).toFormat(dateFormat)}
        </Box>
        <Box sx={{ lineHeight: 2 }}>
          <strong>Updated at</strong>:{' '}
          {DateTime.fromISO(list.updatedAt).toFormat(dateFormat)}
        </Box>
      </CardContent>
    </StyledListCard>
  );
};
