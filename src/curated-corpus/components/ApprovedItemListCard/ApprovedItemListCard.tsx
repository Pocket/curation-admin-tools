import React from 'react';
import {
  Box,
  CardContent,
  CardMedia,
  Link,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';
import AlarmIcon from '@mui/icons-material/Alarm';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CategoryIcon from '@mui/icons-material/Category';
import LanguageIcon from '@mui/icons-material/Language';
import { ApprovedCorpusItem, CuratedStatus } from '../../../api/generatedTypes';
import { getDisplayTopic } from '../../helpers/topics';
import { flattenAuthors } from '../../../_shared/utils/flattenAuthors';
import { ScheduleHistory } from '../';
import { StyledListItemIcon } from '../../../_shared/styled';

import { curationPalette } from '../../../theme';

interface ApprovedItemListCardProps {
  /**
   * An object with everything approved curated item-related in it.
   */
  item: ApprovedCorpusItem;

  /**
   * Optional boolean prop to show/hide the language icon
   */
  showLanguageIcon?: boolean;

  /**
   * Optional boolean prop to show/hide the "Rec." overlay
   */
  showRecommendedOverlay?: boolean;
}

export const ApprovedItemListCard: React.FC<ApprovedItemListCardProps> = (
  props
): JSX.Element => {
  const {
    item,
    showLanguageIcon = true,
    showRecommendedOverlay = true,
  } = props;

  const isRecommendedOverlayVisible =
    showRecommendedOverlay && item.status === CuratedStatus.Recommendation;

  // prefixing the item's imageUrl with the pocket-image-cache url to format it to a size of 600x300
  const formattedImageUrl =
    `https://pocket-image-cache.com/600x300/filters:format(jpg):extract_focal()/`.concat(
      encodeURIComponent(item.imageUrl)
    );

  const showScheduleHistory = item.scheduledSurfaceHistory.length != 0;

  return (
    <>
      <CardMedia
        component="img"
        src={
          item.imageUrl && item.imageUrl.length > 0
            ? formattedImageUrl
            : '/placeholders/collectionSmall.svg'
        }
        alt={item.title}
      />

      {isRecommendedOverlayVisible && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            color: curationPalette.white,
            backgroundColor: curationPalette.primary,
            borderRadius: '0.125rem',
            padding: '0.25rem',
          }}
        >
          Rec
        </Box>
      )}

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
            color: curationPalette.lightGrey,
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

      <List
        dense
        sx={{
          borderBottom: `1px solid ${curationPalette.lightGrey}`,
        }}
      >
        {item.isSyndicated && (
          <ListItem>
            <StyledListItemIcon>
              <CheckCircleOutlineIcon fontSize="small" />
            </StyledListItemIcon>
            <ListItemText primary={'Syndicated'} />
          </ListItem>
        )}
        {item.isCollection && (
          <ListItem>
            <StyledListItemIcon>
              <BookmarksIcon fontSize="small" />
            </StyledListItemIcon>
            <ListItemText primary={'Collection'} />
          </ListItem>
        )}
        {item.isTimeSensitive && (
          <ListItem>
            <StyledListItemIcon>
              <AlarmIcon fontSize="small" />
            </StyledListItemIcon>
            <ListItemText primary={'Time Sensitive'} />
          </ListItem>
        )}
        <ListItem>
          <StyledListItemIcon>
            <CategoryIcon />
          </StyledListItemIcon>
          <ListItemText
            primary={getDisplayTopic(item.topic)}
            sx={{ textTransform: 'capitalize' }}
          />
        </ListItem>
        {showLanguageIcon && (
          <ListItem>
            <StyledListItemIcon>
              <LanguageIcon />
            </StyledListItemIcon>
            <ListItemText primary={item.language.toUpperCase()} />
          </ListItem>
        )}
      </List>
    </>
  );
};
