import React from 'react';
import { ShareableListItem } from '../../../api/generatedTypes';
import { CardMedia, Grid, Hidden, Typography } from '@mui/material';
import { StyledListCard } from '../../../_shared/styled';

interface ShareableListItemCardProps {
  /**
   * An object with everything shareable-list related in it.
   */
  listItem: ShareableListItem;
}

export const ShareableListItemCard: React.FC<ShareableListItemCardProps> = (
  props
): JSX.Element => {
  const { listItem } = props;

  // Work out the image thumbnail so that React does not object to the optional field
  const imageUrl =
    listItem.imageUrl && listItem.imageUrl.length > 0
      ? listItem.imageUrl
      : '/placeholders/story.svg';

  return (
    <StyledListCard square>
      <Grid container spacing={2}>
        <Grid item xs={4} sm={2}>
          <CardMedia
            component="img"
            src={imageUrl}
            alt={listItem.title ?? 'No title'}
            sx={{
              borderRadius: 1,
            }}
          />
        </Grid>
        <Grid item xs={8} sm={10}>
          <Typography
            variant="h5"
            align="left"
            gutterBottom
            sx={{
              fontSize: '1.125rem',
              fontWeight: 500,
              '& a': {
                textDecoration: 'none',
                color: '#222222',
              },
            }}
          >
            <a href={listItem.url} target="_blank" rel="noreferrer">
              {listItem.title ?? 'No title'}
            </a>
          </Typography>

          <Typography
            variant="subtitle2"
            color="textSecondary"
            component="span"
            align="left"
            sx={{ fontWeight: 400 }}
          >
            <span>{listItem.authors ?? 'No authors'}</span> ·{' '}
            <span>{listItem.publisher ?? 'No publisher'}</span>
          </Typography>
          <Hidden smDown implementation="css">
            <Typography component="div">
              {listItem.excerpt ?? 'No excerpt'}
            </Typography>
          </Hidden>
        </Grid>
      </Grid>
    </StyledListCard>
  );
};
