import React from 'react';
import { Card, CardActions, Grid } from '@material-ui/core';
import { useStyles } from './ScheduledItemCardWrapper.styles';
import { ScheduledCorpusItem } from '../../../api/generatedTypes';
import { Button } from '../../../_shared/components';
import { ApprovedItemListCard } from '../ApprovedItemListCard/ApprovedItemListCard';

interface ScheduledItemCardWrapperProps {
  /**
   * An object with everything scheduled curated item-related in it.
   */
  item: ScheduledCorpusItem;

  /**
   * Callback for the "Move to bottom" button
   */
  onMoveToBottom: VoidFunction;

  /**
   * What to do when the "Remove" button is clicked.
   */
  onRemove: VoidFunction;

  /**
   * Callback for the "Reschedule" button
   */
  onReschedule: VoidFunction;

  /**
   * Optional boolean prop to show/hide the language icon on the ApprovedItemListCard component
   */
  showLanguageIcon?: boolean;

  /**
   * Optional boolean prop to show/hide the "Rec." overlay on the ApprovedItemListCard component
   */
  showRecommendedOverlay?: boolean;
}

export const ScheduledItemCardWrapper: React.FC<
  ScheduledItemCardWrapperProps
> = (props): JSX.Element => {
  const classes = useStyles();
  const {
    item,
    onMoveToBottom,
    onRemove,
    onReschedule,
    showLanguageIcon,
    showRecommendedOverlay,
  } = props;

  return (
    <Grid item xs={12} sm={6} md={3}>
      <Card className={classes.root}>
        <ApprovedItemListCard
          item={item.approvedItem}
          showLanguageIcon={showLanguageIcon}
          showRecommendedOverlay={showRecommendedOverlay}
        />

        <CardActions className={classes.actions}>
          <Button buttonType="positive" variant="text" onClick={onReschedule}>
            Reschedule
          </Button>
          <Button buttonType="positive" variant="text" onClick={onMoveToBottom}>
            Move to bottom
          </Button>
          <Button buttonType="negative" variant="text" onClick={onRemove}>
            Remove
          </Button>
        </CardActions>
      </Card>
    </Grid>
  );
};
