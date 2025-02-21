import React, { ReactElement } from 'react';
import { Grid } from '@mui/material';
import {
  ApprovedCorpusItem,
  CorpusItemSource,
} from '../../../api/generatedTypes';

import { StyledScheduledItemCard } from '../../../_shared/styled';
import { StoryItemListCard } from '../StoryItemListCard/StoryItemListCard';
import { CardActionButtonRow } from '../../../_shared/components';

interface SectionItemCardWrapperProps {
  /**
   * An approved corpus item
   */
  item: ApprovedCorpusItem;

  /**
   * Callback for the "Edit" button
   */
  onEdit: VoidFunction;

  /**
   * Callback for the "Reject" (trash) button
   */
  onReject: VoidFunction;

  /**
   * The surface the card is displayed on, e.g. EN_US
   */
  scheduledSurfaceGuid: string;
}

export const SectionItemCardWrapper: React.FC<SectionItemCardWrapperProps> = (
  props,
): ReactElement => {
  const { item, onEdit, onReject, scheduledSurfaceGuid } = props;

  return (
    <Grid item xs={12} sm={6} md={3}>
      <StyledScheduledItemCard variant="outlined">
        <StoryItemListCard
          item={item}
          cardActionButtonRow={
            <CardActionButtonRow onEdit={onEdit} onReject={onReject} />
          }
          isMlScheduled={item.source === CorpusItemSource.Ml}
          scheduledSurfaceGuid={scheduledSurfaceGuid}
        />
      </StyledScheduledItemCard>
    </Grid>
  );
};
