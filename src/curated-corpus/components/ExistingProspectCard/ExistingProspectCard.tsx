import React from 'react';
import {
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
import CategoryIcon from '@material-ui/icons/Category';
import CheckIcon from '@material-ui/icons/Check';
import FaceIcon from '@material-ui/icons/Face';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { DateTime } from 'luxon';

import { useStyles } from './ExistingProspectCard.styles';
import { ApprovedCorpusItem } from '../../../api/generatedTypes';
import { Button } from '../../../_shared/components';
import { getCuratorNameFromLdap } from '../../helpers/helperFunctions';
import { ScheduleHistory } from '../ScheduleHistory/ScheduleHistory';
import { getDisplayTopic } from '../../helpers/topics';
import { DismissProspectAction } from '../actions/DismissProspectAction/DismissProspectAction';

interface ExistingProspectCardProps {
  /**
   * An object with everything approved curated item-related in it.
   */
  item: ApprovedCorpusItem;

  onSchedule: VoidFunction;

  /**
   * Function called when the dismiss (cross) button is clicked
   */
  onDismissProspect: (prospectId: string, errorMessage?: string) => void;
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
  const { item, onSchedule, onDismissProspect } = props;
  const showScheduleHistory = item.scheduledSurfaceHistory.length != 0;

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
            <ListItem disableGutters>
              <ListItemIcon className={classes.listItemIcon}>
                <FaceIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={getCuratorNameFromLdap(item.createdBy)}
                secondary={DateTime.fromSeconds(item.createdAt).toFormat(
                  'MMMM dd, yyyy'
                )}
              />
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={12} sm={9}>
          <Grid container>
            <Grid item xs={11}>
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
            </Grid>
            <Grid item xs={1}>
              {item.prospectId && (
                <DismissProspectAction
                  onDismissProspect={onDismissProspect}
                  prospectId={item.prospectId}
                />
              )}
            </Grid>
          </Grid>
          <Typography
            className={classes.subtitle}
            variant="subtitle2"
            color="textSecondary"
            component="span"
            align="left"
          >
            <span>{item.publisher}</span>
          </Typography>
          <Grid container spacing={1} className={classes.chipContainer}>
            <Grid item>
              <Chip
                variant="outlined"
                color="primary"
                label={getDisplayTopic(item.topic)}
                icon={<CategoryIcon />}
              />
            </Grid>
            <Grid item>
              {item.isSyndicated && (
                <Chip
                  variant="outlined"
                  color="primary"
                  label="Syndicated"
                  icon={<CheckCircleOutlineIcon />}
                />
              )}
            </Grid>
            <Grid item>
              <Chip
                variant="default"
                color="secondary"
                label="Already in corpus"
                icon={<CheckIcon />}
              />
            </Grid>
          </Grid>
          <Typography component="div">{item.excerpt}</Typography>
          {showScheduleHistory && (
            <Grid item xs={12}>
              <ScheduleHistory
                data={item.scheduledSurfaceHistory}
                isProspect={true}
              />
            </Grid>
          )}
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
