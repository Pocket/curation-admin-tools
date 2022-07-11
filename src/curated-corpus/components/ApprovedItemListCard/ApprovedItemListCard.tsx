import React from 'react';
import {
  CardContent,
  CardMedia,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@material-ui/core';
import AlarmIcon from '@material-ui/icons/Alarm';
import BookmarksIcon from '@material-ui/icons/Bookmarks';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import LabelOutlinedIcon from '@material-ui/icons/LabelOutlined';
import LanguageIcon from '@material-ui/icons/Language';
import { useStyles } from './ApprovedItemListCard.styles';
import { ApprovedCorpusItem, CuratedStatus } from '../../../api/generatedTypes';
import { getDisplayTopic } from '../../helpers/helperFunctions';
import { flattenAuthors } from '../../../_shared/utils/flattenAuthors';

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
  const classes = useStyles();
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
        <div className={classes.imageOverlay}>Rec</div>
      )}

      <CardContent className={classes.content}>
        <Typography className={classes.publisher} gutterBottom>
          <span>{item.publisher}</span> &middot;{' '}
          <span>{flattenAuthors(item.authors)}</span>
        </Typography>
        <Typography
          className={classes.title}
          variant="h3"
          align="left"
          gutterBottom
        >
          <Link href={item.url} target="_blank" className={classes.link}>
            {item.title}
          </Link>
        </Typography>
        <Typography variant="body2" component="p" gutterBottom>
          {item.excerpt}
        </Typography>
      </CardContent>

      {/* Push the rest of the elements to the bottom of the card. */}
      <div className={classes.flexGrow} />

      <List dense className={classes.list}>
        {item.isSyndicated && (
          <ListItem>
            <ListItemIcon className={classes.listItemIcon}>
              <CheckCircleOutlineIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={'Syndicated'} />
          </ListItem>
        )}
        {item.isCollection && (
          <ListItem>
            <ListItemIcon className={classes.listItemIcon}>
              <BookmarksIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={'Collection'} />
          </ListItem>
        )}
        {item.isTimeSensitive && (
          <ListItem>
            <ListItemIcon className={classes.listItemIcon}>
              <AlarmIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={'Time Sensitive'} />
          </ListItem>
        )}
        <ListItem>
          <ListItemIcon className={classes.listItemIcon}>
            <LabelOutlinedIcon />
          </ListItemIcon>
          <ListItemText
            className={classes.topic}
            primary={getDisplayTopic(item.topic)}
          />
        </ListItem>
        {showLanguageIcon && (
          <ListItem>
            <ListItemIcon className={classes.listItemIcon}>
              <LanguageIcon />
            </ListItemIcon>
            <ListItemText primary={item.language.toUpperCase()} />
          </ListItem>
        )}
      </List>
    </>
  );
};
