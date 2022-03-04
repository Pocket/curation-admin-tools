import React from 'react';
import { Card, CardActions, Grid } from '@material-ui/core';
import { useStyles } from './ScheduledItemCardWrapper.styles';
import { ScheduledCuratedCorpusItem } from '../../../api/generatedTypes';
import { Button } from '../../../_shared/components';
import { ApprovedItemListCard } from '../ApprovedItemListCard/ApprovedItemListCard';

interface ScheduledItemCardWrapperProps {
  /**
   * An object with everything scheduled curated item-related in it.
   */
  item: ScheduledCuratedCorpusItem;
  /**
   * What to do when the "Remove" button is clicked.
   */
  onRemove?: VoidFunction;

  /**
   * schedule comment fix later
   */
  onReschedule?: VoidFunction;
}

export const ScheduledItemCardWrapper: React.FC<
  ScheduledItemCardWrapperProps
> = (props): JSX.Element => {
  const classes = useStyles();
  const { item, onRemove, onReschedule } = props;

  return (
    <Grid item xs={12} sm={6} md={3}>
      <Card className={classes.root}>
        <ApprovedItemListCard item={item.approvedItem} />

        <CardActions className={classes.actions}>
          <Button buttonType="positive" variant="text" onClick={onReschedule}>
            Reschedule
          </Button>
          <Button buttonType="negative" variant="text" onClick={onRemove}>
            Remove
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};
