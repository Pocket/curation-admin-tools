import React from 'react';
import { Card, CardContent, Link, Typography } from '@mui/material';

import { ShareableListComplete } from '../../../api/generatedTypes';
import { curationPalette } from '../../../theme';

interface ShareableListCardProps {
  /**
   * An object with everything rejected curated item-related in it.
   */
  list: ShareableListComplete;
}

export const ShareableListCard: React.FC<ShareableListCardProps> = (
  props
): JSX.Element => {
  const { list } = props;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
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
            fontSize: '1rem',
            fontWeight: 500,
          }}
        >
          <Link
            href={`https://getpocket.com/sharedlists/${list.externalId}/${list.slug}/`}
            target="_blank"
            sx={{
              textDecoration: 'none',
              color: curationPalette.pocketBlack,
            }}
          >
            {list.title}
          </Link>
        </Typography>
      </CardContent>
    </Card>
  );
};
