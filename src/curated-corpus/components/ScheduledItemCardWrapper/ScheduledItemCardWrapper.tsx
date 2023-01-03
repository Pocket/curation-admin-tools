import React from 'react';
import { Card, CardActions, Grid, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ScheduledCorpusItem } from '../../../api/generatedTypes';
import { curationPalette } from '../../../theme';
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
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        <ApprovedItemListCard
          item={item.approvedItem}
          showLanguageIcon={showLanguageIcon}
          showRecommendedOverlay={showRecommendedOverlay}
        />

        <CardActions
          sx={{
            margin: 'auto',
            paddingLeft: 0,
            '& button': {
              marginLeft: '0 !important',
            },
          }}
        >
          <Button buttonType="positive" variant="text">
            <Link
              to={`/curated-corpus/corpus/item/${item.approvedItem.externalId}`}
              component={RouterLink}
              sx={{
                color: curationPalette.primary,
                textDecoration: 'none',
              }}
            >
              View
            </Link>
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
        </CardActions>
      </Card>
    </Grid>
  );
};
