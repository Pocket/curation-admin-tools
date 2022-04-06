import React from 'react';
import {
  Box,
  Card,
  CardActions,
  CardMedia,
  Chip,
  Grid,
  Link,
  Typography,
} from '@material-ui/core';
import LanguageIcon from '@material-ui/icons/Language';
import LabelOutlinedIcon from '@material-ui/icons/LabelOutlined';
import CheckIcon from '@material-ui/icons/Check';
import { useStyles } from './ExistingProspectCard.styles';
import { ApprovedCorpusItem } from '../../../api/generatedTypes';
import { Button } from '../../../_shared/components';
import { getDisplayTopic } from '../../helpers/helperFunctions';

interface ExistingProspectCardProps {
  /**
   * An object with everything approved curated item-related in it.
   */
  item: ApprovedCorpusItem;

  onSchedule: VoidFunction;
}

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
              label={item.language}
              icon={<LanguageIcon />}
            />{' '}
            <Chip
              variant="outlined"
              color="primary"
              label={getDisplayTopic(item.topic)}
              icon={<LabelOutlinedIcon />}
            />{' '}
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
