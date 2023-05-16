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
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import CategoryIcon from '@mui/icons-material/Category';
import CheckIcon from '@mui/icons-material/Check';
import FaceIcon from '@mui/icons-material/Face';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { DateTime } from 'luxon';

import { curationPalette } from '../../../theme';
import { ApprovedCorpusItem } from '../../../api/generatedTypes';
import { Button } from '../../../_shared/components';
import { getCuratorNameFromLdap } from '../../helpers/helperFunctions';
import { ScheduleHistory } from '../ScheduleHistory/ScheduleHistory';
import { getDisplayTopic } from '../../helpers/topics';
import { DismissProspectAction } from '../actions/DismissProspectAction/DismissProspectAction';
import { flattenAuthors } from '../../../_shared/utils/flattenAuthors';

interface ExistingProspectCardProps {
  /**
   * An object with everything approved curated item-related in it.
   */
  item: ApprovedCorpusItem;

  /**
   * This is the prospect.id and NOT prospect.prospectId
   */
  prospectId: string;

  /**
   * Function called when the scheduled button is clicked.
   */
  onSchedule: VoidFunction;

  /**
   * Function called when the dismiss (cross) button is clicked.
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
  const { item, onSchedule, onDismissProspect, prospectId } = props;
  const showScheduleHistory = item.scheduledSurfaceHistory.length != 0;

  return (
    <Card
      sx={{
        padding: '0.5rem',
        display: 'flex',
        flexDirection: 'column',
        marginBottom: '2rem',
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          <CardMedia
            component="img"
            src={item.imageUrl}
            alt={item.title}
            sx={{
              borderRadius: 1,
              border: `1px solid ${curationPalette.lightGrey}`,
            }}
          />

          {/* Note that minWidth style overrides only work inside an `sx` property, not a styled component. */}
          <List dense disablePadding>
            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: '1.5rem' }}>
                <LanguageIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText secondary={item.language} />
            </ListItem>
            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: '1.5rem' }}>
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
              <Link
                href={item.url}
                target="_blank"
                sx={{
                  textDecoration: 'none',
                  padding: '1.25 rem 0',
                  color: curationPalette.pocketBlack,
                }}
              >
                <Typography
                  variant="h5"
                  align="left"
                  gutterBottom
                  sx={{
                    fontSize: {
                      xs: '1rem',
                      sm: '1.25rem',
                    },
                    fontWeight: 500,
                  }}
                >
                  {item.title}
                </Typography>
              </Link>
            </Grid>
            <Grid item xs={1} sx={{ textAlign: 'center' }}>
              <DismissProspectAction
                onDismissProspect={onDismissProspect}
                prospectId={prospectId}
              />
            </Grid>
          </Grid>
          <Typography
            variant="subtitle2"
            color="textSecondary"
            component="span"
            align="left"
            sx={{ fontWeight: 400 }}
          >
            <span>
              {item.authors ? flattenAuthors(item.authors) : 'Authors: N/A'}
            </span>{' '}
            &middot; <span>{item.publisher}</span>
          </Typography>
          <Grid
            container
            spacing={1}
            sx={{ paddingTop: '0.5em', paddingBottom: '0.5em' }}
          >
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
                variant="filled"
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

      <CardActions sx={{ margin: 'auto' }}>
        <Button buttonType="positive" variant="text" onClick={onSchedule}>
          Schedule
        </Button>
      </CardActions>
    </Card>
  );
};
