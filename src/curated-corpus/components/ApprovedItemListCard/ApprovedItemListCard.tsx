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
import FaceIcon from '@material-ui/icons/Face';
import LabelOutlinedIcon from '@material-ui/icons/LabelOutlined';
import LanguageIcon from '@material-ui/icons/Language';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import { useStyles } from './ApprovedItemListCard.styles';
import { ApprovedCuratedCorpusItem } from '../../api/curated-corpus-api/generatedTypes';
import { topics } from '../../helpers/definitions';

interface ApprovedItemListCardProps {
  /**
   * An object with everything approved curated item-related in it.
   */
  item: ApprovedCuratedCorpusItem;
}

export const ApprovedItemListCard: React.FC<ApprovedItemListCardProps> = (
  props
): JSX.Element => {
  const classes = useStyles();
  const { item } = props;

  // This finds the corresponding display name topic from the
  // Topics enum
  const displayTopic = topics.find((topic) => {
    return topic.code === item.topic;
  })?.name;

  return (
    <>
      <CardMedia
        component="img"
        src={
          item.imageUrl && item.imageUrl.length > 0
            ? item.imageUrl
            : '/placeholders/collectionSmall.svg'
        }
        alt={item.title}
      />
      <CardContent className={classes.content}>
        <Typography className={classes.publisher} gutterBottom>
          {item.publisher}
        </Typography>
        <Typography
          className={classes.title}
          variant="h3"
          align="left"
          gutterBottom
        >
          <Link href={item.url} className={classes.link}>
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
        <ListItem>
          <ListItemIcon className={classes.listItemIcon}>
            <ThumbUpIcon />
          </ListItemIcon>
          <ListItemText
            className={classes.status}
            primary={item.status.toLowerCase()}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon className={classes.listItemIcon}>
            <FaceIcon />
          </ListItemIcon>
          <ListItemText className={classes.topic} primary={item.createdBy} />
        </ListItem>
        <ListItem>
          <ListItemIcon className={classes.listItemIcon}>
            <LabelOutlinedIcon />
          </ListItemIcon>
          <ListItemText className={classes.topic} primary={displayTopic} />
        </ListItem>
        <ListItem divider>
          <ListItemIcon className={classes.listItemIcon}>
            <LanguageIcon />
          </ListItemIcon>
          <ListItemText primary={item.language.toUpperCase()} />
        </ListItem>
        {item.isSyndicated && (
          <ListItem>
            <ListItemIcon className={classes.listItemIcon}>
              <CheckCircleOutlineIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText secondary={'Syndicated'} />
          </ListItem>
        )}
        {item.isCollection && (
          <ListItem>
            <ListItemIcon className={classes.listItemIcon}>
              <BookmarksIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText secondary={'Collection'} />
          </ListItem>
        )}
        {item.isShortLived && (
          <ListItem>
            <ListItemIcon className={classes.listItemIcon}>
              <AlarmIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText secondary={'Short-lived'} />
          </ListItem>
        )}
      </List>
    </>
  );
};
