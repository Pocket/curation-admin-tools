import React from 'react';
import { Item, Prospect } from '../../../api/generatedTypes';
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
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CategoryIcon from '@mui/icons-material/Category';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import { curationPalette } from '../../../theme';
import { Button } from '../../../_shared/components';
import { getDisplayTopic } from '../../helpers/topics';
import { DismissProspectAction } from '../actions/DismissProspectAction/DismissProspectAction';
import { DateTime } from 'luxon';

interface ProspectListCardProps {
  /**
   * An object with everything prospect-related in it.
   */
  prospect: Prospect;

  /**
   * Parser Item type representation of this Prospect item
   */

  parserItem: Item;
  /**
   * Function called when "Add to Corpus" button is clicked
   */
  onAddToCorpus: VoidFunction;

  /**
   * Function called when the dismiss (cross) button is clicked
   */
  onDismissProspect: (prospectId: string, errorMessage?: string) => void;

  /**
   * Function called when "Recommend" button is clicked
   */
  onRecommend: VoidFunction;
  /**
   * What to do when the user presses the "Reject" button on the card.
   */
  onReject: () => void;
}

export const ProspectListCard: React.FC<ProspectListCardProps> = (
  props
): JSX.Element => {
  const {
    prospect,
    parserItem,
    onAddToCorpus,
    onDismissProspect,
    onRecommend,
    onReject,
  } = props;

  const timeToRead = parserItem?.timeToRead ? (
    `${parserItem.timeToRead} min(s)`
  ) : (
    <span> &mdash;</span>
  );

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
            src={
              prospect.imageUrl && prospect.imageUrl.length > 0
                ? prospect.imageUrl
                : '/placeholders/collectionSmall.svg'
            }
            alt={prospect.title ?? 'No title supplied'}
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
              <ListItemText
                secondary={prospect.language?.toUpperCase() ?? 'N/A'}
              />
            </ListItem>

            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: '1.5rem' }}>
                <FavoriteBorderIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText secondary={`${prospect.saveCount} saves`} />
            </ListItem>

            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: '1.5rem' }}>
                <MyLocationIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText secondary={prospect.prospectType.toLowerCase()} />
            </ListItem>

            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: '1.5rem' }}>
                <AccessTimeIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText secondary={timeToRead} />
            </ListItem>

            <ListItem disableGutters>
              <ListItemText
                secondary={
                  parserItem?.datePublished &&
                  `Published ${DateTime.fromJSDate(
                    new Date(parserItem?.datePublished)
                  ).toFormat('MMMM dd, yyyy')}`
                }
              />
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={12} sm={9}>
          <Grid container>
            <Grid item xs={11}>
              <Link
                href={prospect.url}
                target="_blank"
                underline="hover"
                sx={{
                  textDecoration: 'none',
                  padding: '1.25 rem 0',
                  color: curationPalette.primary,
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
                  {prospect.title}
                </Typography>
              </Link>
            </Grid>
            <Grid item xs={1} sx={{ textAlign: 'center' }}>
              <DismissProspectAction
                onDismissProspect={onDismissProspect}
                prospectId={prospect.id}
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
            <span>{prospect.authors ? prospect.authors : 'Authors: N/A'}</span>{' '}
            &middot; <span>{prospect.publisher}</span> &middot;{' '}
            <span>{prospect.domain}</span>
          </Typography>
          <Grid container sx={{ paddingTop: '0.5em', paddingBottom: '0.5em' }}>
            <Grid item>
              <Chip
                variant="outlined"
                color="primary"
                label={getDisplayTopic(prospect.topic)}
                icon={<CategoryIcon />}
              />
            </Grid>
            <Grid item>
              {prospect.isSyndicated && (
                <Chip
                  variant="outlined"
                  color="primary"
                  label="Syndicated"
                  icon={<CheckCircleOutlineIcon />}
                />
              )}
            </Grid>
          </Grid>
          <Typography component="div">{prospect.excerpt}</Typography>{' '}
        </Grid>
      </Grid>
      <CardActions sx={{ margin: 'auto' }}>
        <Button buttonType="positive" variant="text" onClick={onRecommend}>
          Recommend
        </Button>
        <Button buttonType="positive" variant="text" onClick={onAddToCorpus}>
          Add to Corpus
        </Button>
        <Button buttonType="negative" variant="text" onClick={onReject}>
          Reject
        </Button>
      </CardActions>
    </Card>
  );
};
