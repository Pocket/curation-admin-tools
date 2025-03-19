import React, { ReactNode } from 'react';
import { IconButton, Tooltip, Stack } from '@mui/material';
import { curationPalette } from '../../../theme';

export interface CardAction {
  /**
   * The name of the button action (i.e. "Edit")
   */
  actionName: string;
  /**
   * The material UI icon
   */
  icon: ReactNode;
  /**
   * Callback for the button
   */
  onClick: VoidFunction;
}

interface CardActionButtonRowProps {
  /**
   * Card action buttons aligned to bottom left
   */
  cardActionButtonsLeft?: CardAction[];
  /**
   * Card action buttons aligned to bottom right
   */
  cardActionButtonsRight?: CardAction[];
}

export const CardActionButtonRow: React.FC<CardActionButtonRowProps> = (
  props,
): JSX.Element => {
  const { cardActionButtonsLeft = [], cardActionButtonsRight = [] } = props;
  const renderCardActionButtons = (actions: CardAction[]): ReactNode => {
    return actions.map(({ actionName, icon, onClick }) => (
      <Tooltip key={actionName} title={actionName} placement="bottom">
        <IconButton
          aria-label={actionName.toLowerCase().replace(/\s/g, '-')}
          onClick={onClick}
          sx={{ color: curationPalette.jetBlack }}
        >
          {icon}
        </IconButton>
      </Tooltip>
    ));
  };

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      mb="0.5rem"
      mr="0.5rem"
      ml="0.5rem"
    >
      <Stack direction="row">
        {/*buttons aligned on bottom left of card*/}
        {renderCardActionButtons(cardActionButtonsLeft)}
      </Stack>
      <Stack direction="row">
        {/*buttons aligned on bottom right of card*/}
        {renderCardActionButtons(cardActionButtonsRight)}
      </Stack>
    </Stack>
  );
};
