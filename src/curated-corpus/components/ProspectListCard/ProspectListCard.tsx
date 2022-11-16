import React from 'react';
import { Prospect } from '../../../api/generatedTypes';
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
import { useStyles } from './ProspectListCard.styles';
import LanguageIcon from '@material-ui/icons/Language';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import MyLocationIcon from '@material-ui/icons/MyLocation';
import { Button } from '../../../_shared/components';
import { getDisplayTopic } from '../../helpers/topics';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import { DismissProspectAction } from '../actions/DismissProspectAction/DismissProspectAction';
import CategoryIcon from '@material-ui/icons/Category';

interface ProspectListCardProps {
  /**
   * An object with everything prospect-related in it.
   */
  prospect: Prospect;

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
  const classes = useStyles();
  const { prospect, onAddToCorpus, onDismissProspect, onRecommend, onReject } =
    props;

  return (
    <Card className={classes.root}>
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
            className={classes.image}
          />

          <List dense disablePadding>
            <ListItem disableGutters>
              <ListItemIcon className={classes.listItemIcon}>
                <LanguageIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                secondary={prospect.language?.toUpperCase() ?? 'N/A'}
              />
            </ListItem>

            <ListItem disableGutters>
              <ListItemIcon className={classes.listItemIcon}>
                <FavoriteBorderIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText secondary={`${prospect.saveCount} saves`} />
            </ListItem>

            <ListItem disableGutters>
              <ListItemIcon className={classes.listItemIcon}>
                <MyLocationIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText secondary={prospect.prospectType.toLowerCase()} />
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={12} sm={9}>
          <Grid container>
            <Grid item xs={11}>
              <Link
                href={prospect.url}
                target="_blank"
                className={classes.link}
              >
                <Typography
                  className={classes.title}
                  variant="h3"
                  align="left"
                  gutterBottom
                >
                  {prospect.title}
                </Typography>
              </Link>
            </Grid>
            <Grid
              item
              xs={1}
              className={classes.dismissProspectButtonContainer}
            >
              <DismissProspectAction
                onDismissProspect={onDismissProspect}
                prospectId={prospect.id}
              />
            </Grid>
          </Grid>
          <Typography
            className={classes.subtitle}
            variant="subtitle2"
            color="textSecondary"
            component="span"
            align="left"
          >
            <span>{prospect.authors ? prospect.authors : 'Authors: N/A'}</span>{' '}
            &middot; <span>{prospect.publisher}</span> &middot;
            <span>{prospect.domain}</span>
          </Typography>
          <Grid container className={classes.chipContainer}>
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
          <Typography component="div">{prospect.excerpt}</Typography>
        </Grid>
      </Grid>
      <CardActions className={classes.actions}>
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
