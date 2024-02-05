import React from 'react';
import { Grid } from '@mui/material';
import { ScheduledCorpusItem } from '../../../api/generatedTypes';
import { Button } from '../../../_shared/components';
import {
  StyledCardActions,
  StyledCorpusItemCard,
} from '../../../_shared/styled';
import { ApprovedItemListCard } from '../';

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
   * Callback for the "Edit" button
   */
  onEdit: VoidFunction;

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
  const {
    item,
    onMoveToBottom,
    onRemove,
    onReschedule,
    onEdit,
    showLanguageIcon,
    showRecommendedOverlay,
  } = props;

  return (
    <Grid item xs={12} sm={6} md={3}>
      <StyledCorpusItemCard>
        <ApprovedItemListCard
          item={item.approvedItem}
          showLanguageIcon={showLanguageIcon}
          showRecommendedOverlay={showRecommendedOverlay}
        />

        <StyledCardActions>
          <Button buttonType="positive" variant="text" onClick={onEdit}>
            Edit
          </Button>
          <Button buttonType="positive" variant="text" onClick={onReschedule}>
            Reschedule
          </Button>
          <Button buttonType="positive" variant="text" onClick={onMoveToBottom}>
            Move to bottom
          </Button>
          <Button buttonType="negative" variant="text" onClick={onRemove}>
            Remove
          </Button>
        </StyledCardActions>
      </StyledCorpusItemCard>
    </Grid>
  );
};
