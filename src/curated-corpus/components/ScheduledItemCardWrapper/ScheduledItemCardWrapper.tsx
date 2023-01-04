import React from 'react';
import { Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ScheduledCorpusItem } from '../../../api/generatedTypes';
import { Button } from '../../../_shared/components';
import {
  StyledCardActions,
  StyledCorpusItemCard,
  StyledLinkButton,
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
          <Button buttonType="positive" variant="text">
            <StyledLinkButton
              to={`/curated-corpus/corpus/item/${item.approvedItem.externalId}`}
              component={RouterLink}
            >
              View
            </StyledLinkButton>
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
