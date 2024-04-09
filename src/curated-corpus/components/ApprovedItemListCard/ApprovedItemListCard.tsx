import React from 'react';
import {
  Box,
  CardContent,
  CardMedia,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import AlarmIcon from '@mui/icons-material/Alarm';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CategoryIcon from '@mui/icons-material/Category';
import LanguageIcon from '@mui/icons-material/Language';
import {
  ApprovedCorpusItem,
  CorpusLanguage,
  CuratedStatus,
} from '../../../api/generatedTypes';
import { getDisplayTopic } from '../../helpers/topics';
import { flattenAuthors } from '../../../_shared/utils/flattenAuthors';
import { ScheduleHistory } from '../';

import { curationPalette } from '../../../theme';
import { applyApTitleCase } from '../../../_shared/utils/applyApTitleCase';

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
  const isItemEnglish = item.language.toUpperCase() === CorpusLanguage.En;

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
            {isItemEnglish && applyApTitleCase(item.title)}
            {!isItemEnglish && item.title}
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

      {/* Note that minWidth style overrides only work inside an `sx` property, not a styled component. */}
      <List
        dense
        sx={{
          borderBottom: `1px solid ${curationPalette.lightGrey}`,
        }}
      >
        {item.isSyndicated && (
          <ListItem>
            <ListItemIcon sx={{ minWidth: '2rem' }}>
              <CheckCircleOutlineIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={'Syndicated'} />
          </ListItem>
        )}
        {item.isCollection && (
          <ListItem>
            <ListItemIcon sx={{ minWidth: '2rem' }}>
              <BookmarksIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={'Collection'} />
          </ListItem>
        )}
        {item.isTimeSensitive && (
          <ListItem>
            <ListItemIcon sx={{ minWidth: '2rem' }}>
              <AlarmIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={'Time Sensitive'} />
          </ListItem>
        )}
        <ListItem>
          <ListItemIcon sx={{ minWidth: '2rem' }}>
            <CategoryIcon />
          </ListItemIcon>
          <ListItemText
            primary={getDisplayTopic(item.topic)}
            sx={{ textTransform: 'capitalize' }}
          />
        </ListItem>
        {showLanguageIcon && (
          <ListItem>
            <ListItemIcon sx={{ minWidth: '2rem' }}>
              <LanguageIcon />
            </ListItemIcon>
            <ListItemText primary={item.language.toUpperCase()} />
          </ListItem>
        )}
      </List>
    </>
  );
};
