import React from 'react';
import { Card, CardActions, Grid } from '@material-ui/core';
import { useStyles } from './ScheduledItemCardWrapper.styles';
import { ScheduledCuratedCorpusItem } from '../../api/curated-corpus-api/generatedTypes';
import { Button } from '../../../_shared/components';
import { ApprovedItemListCard } from '../ApprovedItemListCard/ApprovedItemListCard';

interface ScheduledItemCardWrapperProps {
  /**
   * An object with everything scheduled curated item-related in it.
   */
  item: ScheduledCuratedCorpusItem;
}

export const ScheduledItemCardWrapper: React.FC<ScheduledItemCardWrapperProps> =
  (props): JSX.Element => {
    const classes = useStyles();
    const { item } = props;

    return (
      <Grid item xs={12} sm={6} md={3}>
        <Card className={classes.root}>
          <ApprovedItemListCard item={item.approvedItem} />

          <CardActions className={classes.actions}>
            <Button buttonType="negative" variant="text">
              Remove
            </Button>
          </CardActions>
        </Card>
      </Grid>
    );
  };