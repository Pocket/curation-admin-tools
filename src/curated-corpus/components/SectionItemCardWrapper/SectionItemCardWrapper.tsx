import React, { ReactElement } from 'react';
import { Grid } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import {
  ApprovedCorpusItem,
  CorpusItemSource,
} from '../../../api/generatedTypes';

import { StyledScheduledItemCard } from '../../../_shared/styled';
import { StoryItemListCard } from '../StoryItemListCard/StoryItemListCard';
import { CardAction, CardActionButtonRow } from '../../../_shared/components';

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
   * Callback for the "Remove" (X) button
   */
  onRemove: VoidFunction;

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
  const { item, onEdit, onRemove, onReject, scheduledSurfaceGuid } = props;

  // card action buttons to be rendered & aligned on bottom left
  const cardActionButtonsLeft: CardAction[] = [
    {
      actionName: 'Reject',
      icon: <DeleteOutlinedIcon />,
      onClick: () => onReject(),
    },
    { actionName: 'Edit', icon: <EditOutlinedIcon />, onClick: () => onEdit() },
  ];
  // card action buttons to be rendered & aligned on bottom right
  const cardActionButtonsRight: CardAction[] = [
    { actionName: 'Remove', icon: <ClearIcon />, onClick: () => onRemove() },
  ];

  return (
    <Grid item xs={12} sm={6} md={3}>
      <StyledScheduledItemCard variant="outlined">
        <StoryItemListCard
          item={item}
          cardActionButtonRow={
            <CardActionButtonRow
              cardActionButtonsLeft={cardActionButtonsLeft}
              cardActionButtonsRight={cardActionButtonsRight}
            />
          }
          isMlScheduled={item.source === CorpusItemSource.Ml}
          scheduledSurfaceGuid={scheduledSurfaceGuid}
        />
      </StyledScheduledItemCard>
    </Grid>
  );
};
