import React from 'react';
import {
  Box,
  Card,
  CardActions,
  CardMedia,
  Chip,
  Grid,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@material-ui/core';
import LanguageIcon from '@material-ui/icons/Language';
import LabelOutlinedIcon from '@material-ui/icons/LabelOutlined';
import CheckIcon from '@material-ui/icons/Check';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

import { useStyles } from './ExistingProspectCard.styles';
import { ApprovedCorpusItem } from '../../../api/generatedTypes';
import { Button } from '../../../_shared/components';
import { getDisplayTopic } from '../../helpers/topics';

interface ExistingProspectCardProps {
  /**
   * An object with everything approved curated item-related in it.
   */
  item: ApprovedCorpusItem;

  onSchedule: VoidFunction;
}

/**
 * This component is used on the Prospecting page to display prospects that are
 * already in the curated corpus.
 *
 * @param props
 * @constructor
 */
export const ExistingProspectCard: React.FC<ExistingProspectCardProps> = (
  props
): JSX.Element => {
  const classes = useStyles();
  const { item, onSchedule } = props;

  return (
    <Card className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          <CardMedia
            component="img"
            src={item.imageUrl}
            alt={item.title}
            className={classes.image}
          />

          <List dense disablePadding>
            <ListItem disableGutters>
              <ListItemIcon className={classes.listItemIcon}>
                <LanguageIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText secondary={item.language} />
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={12} sm={9}>
          <Link href={item.url} target="_blank" className={classes.link}>
            <Typography
              className={classes.title}
              variant="h3"
              align="left"
              gutterBottom
            >
              {item.title}
            </Typography>
          </Link>
          <Typography
            className={classes.subtitle}
            variant="subtitle2"
            color="textSecondary"
            component="span"
            align="left"
          >
            <span>{item.publisher}</span>
          </Typography>
          <Box py={1}>
            <Chip
              variant="outlined"
              color="primary"
              label={getDisplayTopic(item.topic)}
              icon={<LabelOutlinedIcon />}
            />{' '}
            {item.isSyndicated && (
              <Chip
                variant="outlined"
                color="primary"
                label="Syndicated"
                icon={<CheckCircleOutlineIcon />}
              />
            )}{' '}
            <Chip
              variant="default"
              color="secondary"
              label="Already in corpus"
              icon={<CheckIcon />}
            />
          </Box>
          <Typography component="div">{item.excerpt}</Typography>
        </Grid>
      </Grid>

      <CardActions className={classes.actions}>
        <Button buttonType="positive" variant="text" onClick={onSchedule}>
          Schedule
        </Button>
      </CardActions>
    </Card>
  );
};
