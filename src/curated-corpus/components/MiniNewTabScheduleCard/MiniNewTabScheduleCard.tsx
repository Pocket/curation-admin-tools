import React from 'react';
import { ScheduledCuratedCorpusItem } from '../../api/curated-corpus-api/generatedTypes';
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
import LabelOutlinedIcon from '@material-ui/icons/LabelOutlined';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import BookmarksIcon from '@material-ui/icons/Bookmarks';
import { useStyles } from './MiniNewTabScheduleCard.styles';

interface MiniScheduledItemListCardProps {
  item: ScheduledCuratedCorpusItem;
}

/**
 * This component renders a small card for each scheduled item passed to it.
 * It is used to display today & tomorrow's New Tab entries in the sidebar
 * of the New Tab Curation page.
 *
 * @param props
 * @constructor
 */
export const MiniNewTabScheduleCard: React.FC<MiniScheduledItemListCardProps> =
  (props): JSX.Element => {
    const classes = useStyles();
    const { item } = props;

    return (
      <Card className={classes.root}>
        <CardContent className={classes.content}>
          <Typography
            className={classes.title}
            variant="h3"
            align="left"
            gutterBottom
          >
            <Link href={item.approvedItem.url} className={classes.link}>
              {item.approvedItem.title}
            </Link>
          </Typography>
          <Typography className={classes.publisher} gutterBottom>
            {item.approvedItem.publisher}
          </Typography>
          <List dense disablePadding>
            <ListItem disableGutters>
              <ListItemIcon className={classes.listItemIcon}>
                <LabelOutlinedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                className={classes.listItemText}
                secondary={item.approvedItem.topic.toLowerCase()}
              />
            </ListItem>
            {item.approvedItem.isSyndicated && (
              <ListItem disableGutters>
                <ListItemIcon className={classes.listItemIcon}>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  className={classes.listItemText}
                  secondary={'Syndicated'}
                />
              </ListItem>
            )}
            {item.approvedItem.isCollection && (
              <ListItem disableGutters>
                <ListItemIcon className={classes.listItemIcon}>
                  <BookmarksIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText
                  className={classes.listItemText}
                  secondary={'Collection'}
                />
              </ListItem>
            )}
          </List>
        </CardContent>
      </Card>
    );
  };
