import React from 'react';
import { Box, CardContent, Link, Typography } from '@mui/material';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { ShareableListModal } from '../';
import {
  ShareableListComplete,
  ShareableListStatus,
  ShareableListModerationStatus,
} from '../../../api/generatedTypes';
import { Button, Chip } from '../../../_shared/components';
import { DateTime } from 'luxon';
import { StyledListCard } from '../../../_shared/styled';
import { useToggle } from '../../../_shared/hooks';
import { curationPalette } from '../../../theme';

interface ShareableListCardProps {
  /**
   * An object with everything shareable-list related in it.
   */
  list: ShareableListComplete;

  /**
   * A helper function from Apollo Client that triggers a new API call to refetch
   * the data for a given query.
   */
  refetch: VoidFunction;
}

// Exporting for unit testing
export const dateFormat = 'MMMM dd, yyyy HH:MM:ss';

export const ShareableListCard: React.FC<ShareableListCardProps> = (
  props
): JSX.Element => {
  const { list, refetch } = props;

  const [shareableListModalOpen, toggleShareableListModal] = useToggle(false);

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
          {list.moderationStatus === ShareableListModerationStatus.Visible && (
            <Chip label={list.moderationStatus} color="primary" />
          )}
          {list.moderationStatus === ShareableListModerationStatus.Hidden && (
            <Chip label={list.moderationStatus} color="secondary" />
          )}
        </Typography>
        <Box sx={{ lineHeight: 2 }}>
          {list.moderationStatus === ShareableListModerationStatus.Hidden && (
            <Box sx={{ lineHeight: 2, color: curationPalette.secondary }}>
              <strong>This list has been hidden.</strong>
            </Box>
          )}
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
        {list.moderationStatus === ShareableListModerationStatus.Hidden && (
          <Box sx={{ lineHeight: 2 }}>
            <strong>Moderation Reason</strong>: {list.moderationReason}
          </Box>
        )}
        {list.moderationStatus === ShareableListModerationStatus.Hidden &&
          list.moderationDetails && (
            <Box sx={{ lineHeight: 2 }}>
              <strong>Moderation Details</strong>: {list.moderationDetails}
            </Box>
          )}
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
        {list.moderationStatus === ShareableListModerationStatus.Visible && (
          <Box display="flex">
            <ShareableListModal
              isOpen={shareableListModalOpen}
              toggleModal={toggleShareableListModal}
              modalTitle="Hide List"
              refetch={refetch}
              shareableList={list}
              runModerateShareableListMutation={true} // this modal is in charge of moderating a list, so passing flag
            />
            <Button
              buttonType="negative"
              startIcon={<VisibilityOffIcon />}
              variant="text"
              onClick={toggleShareableListModal}
            >
              Hide List
            </Button>
          </Box>
        )}
      </CardContent>
    </StyledListCard>
  );
};
