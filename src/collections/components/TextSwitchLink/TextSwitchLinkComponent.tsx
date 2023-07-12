import { Link, styled, Tooltip } from '@mui/material';
import React from 'react';
import { DescriptionTextStates, ShowTextLinkCallback } from './TextSwitchLink';

const StyledLink = styled(Link)({
  cursor: 'pointer',
});

interface TextSwitchLinkComponentParams {
  linkDescriptionText: string;
  textToInsert: string;
  nextDescriptionState: DescriptionTextStates;
  actionCallback: ShowTextLinkCallback;
}

export const TextSwitchLinkComponent = ({
  linkDescriptionText,
  textToInsert,
  nextDescriptionState,
  actionCallback,
}: TextSwitchLinkComponentParams): JSX.Element => (
  <Tooltip title={textToInsert} arrow>
    <StyledLink
      onClick={() => {
        actionCallback(textToInsert, nextDescriptionState);
      }}
      sx={{ textDecoration: 'none' }}
    >
      {linkDescriptionText}
    </StyledLink>
  </Tooltip>
);
