import React from 'react';
import {
  Card,
  CardContent,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@material-ui/core';
import LanguageIcon from '@material-ui/icons/Language';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import FaceIcon from '@material-ui/icons/Face';
import CategoryIcon from '@material-ui/icons/Category';

import { useStyles } from './RejectedItemListCard.styles';
import { RejectedCorpusItem } from '../../../api/generatedTypes';

interface RejectedItemListCardProps {
  /**
   * An object with everything rejected curated item-related in it.
   */
  item: RejectedCorpusItem;
}

export const RejectedItemListCard: React.FC<RejectedItemListCardProps> = (
  props
): JSX.Element => {
  const classes = useStyles();
  const { item } = props;

  return (
    <Card className={classes.root}>
      <CardContent className={classes.content}>
        <Typography className={classes.publisher} gutterBottom>
          {item.publisher ?? 'N/A'}
        </Typography>
        <Typography
          className={classes.title}
          variant="h3"
          align="left"
          gutterBottom
        >
          <Link href={item.url} target="_blank" className={classes.link}>
            {item.title ?? 'N/A'}
          </Link>
        </Typography>
      </CardContent>

      {/* Push the rest of the elements to the bottom of the card. */}
      <div className={classes.flexGrow} />

      <List dense className={classes.list}>
        <ListItem>
          <ListItemIcon className={classes.listItemIcon}>
            <ThumbDownIcon />
          </ListItemIcon>
          <ListItemText className={classes.reason} primary={item.reason} />
        </ListItem>
        <ListItem>
          <ListItemIcon className={classes.listItemIcon}>
            <FaceIcon />
          </ListItemIcon>
          <ListItemText
            className={classes.createdBy}
            primary={item.createdBy}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon className={classes.listItemIcon}>
            <CategoryIcon />
          </ListItemIcon>
          <ListItemText
            className={classes.topic}
            primary={item.topic ?? 'N/A'}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon className={classes.listItemIcon}>
            <LanguageIcon />
          </ListItemIcon>
          <ListItemText
            primary={item.language ? item.language.toUpperCase() : 'N/A'}
          />
        </ListItem>
      </List>
    </Card>
  );
};
