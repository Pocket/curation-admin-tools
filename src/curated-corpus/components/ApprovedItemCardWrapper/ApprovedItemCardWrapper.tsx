import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { ApprovedCorpusItem } from '../../../api/generatedTypes';
import { Button } from '../../../_shared/components';
import {
  StyledCardActions,
  StyledCorpusItemCard,
  StyledLinkButton,
} from '../../../_shared/styled';
import { ApprovedItemListCard } from '../';

interface ApprovedItemCardWrapperProps {
  /**
   * An object with everything approved curated item-related in it.
   */
  item: ApprovedCorpusItem;

  /**
   * Action to run when the "Reject" button is pressed underneath the card.
   */
  onReject: VoidFunction;

  /**
   * Action to run when the "Schedule" button is pressed underneath the card.
   */
  onSchedule: VoidFunction;

  /**
   * Action to run when the "Edit" button is pressed underneath the card.
   */
  onEdit: VoidFunction;
}

/**
 * This component wraps around ApprovedItemListCard and adds action buttons
 * needed on the Curated Corpus -> Corpus page.
 *
 * @param props
 * @constructor
 */
export const ApprovedItemCardWrapper: React.FC<ApprovedItemCardWrapperProps> = (
  props,
): JSX.Element => {
  const { item, onEdit, onReject, onSchedule } = props;

  return (
    <StyledCorpusItemCard>
      <ApprovedItemListCard item={item} />

      <StyledCardActions>
        <Button buttonType="positive" variant="text">
          <StyledLinkButton
            to={`/curated-corpus/corpus/item/${item.externalId}`}
            component={RouterLink}
          >
            View
          </StyledLinkButton>
        </Button>
        <Button buttonType="positive" variant="text" onClick={onSchedule}>
          Schedule
        </Button>
        <Button buttonType="negative" variant="text" onClick={onReject}>
          Reject
        </Button>
        <Button buttonType="positive" variant="text" onClick={onEdit}>
          Edit
        </Button>
      </StyledCardActions>
    </StyledCorpusItemCard>
  );
};
