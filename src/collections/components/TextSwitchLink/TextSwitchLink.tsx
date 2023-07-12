import React from 'react';
import { TextSwitchLinkComponent } from './TextSwitchLinkComponent';

/**
 * Options for choosing between two possible text descriptions in the 'excerpt' field
 * By default OpenGraph description is used, but the user can restore the parser description
 */
export enum DescriptionTextStates {
  // Means we don't have both Parser and Opengraph desription so there is no UI to show
  IncompleteDescription,
  CanInsertParserDesc,
  CanRestoreOGDesc,
  MatchingDescriptions,
}
export interface ShowTextLinkCallback {
  (textToInsert: string, newDescriptionState: DescriptionTextStates): void;
}

interface TextSwitchLinkParams {
  descriptionState: DescriptionTextStates;
  parserItemExcerptText: string;
  ogExcerptText: string;
  actionCallback: ShowTextLinkCallback;
}

export const TextSwitchLink = ({
  descriptionState,
  parserItemExcerptText,
  ogExcerptText,
  actionCallback,
}: TextSwitchLinkParams): JSX.Element | null => {
  let nextDescriptionState = null;
  let uiText = null;
  let textToInsert = null;

  switch (descriptionState) {
    case DescriptionTextStates.CanInsertParserDesc:
      uiText = 'Use Parser Excerpt Instead';
      nextDescriptionState = DescriptionTextStates.CanRestoreOGDesc;
      textToInsert = parserItemExcerptText;
      break;
    case DescriptionTextStates.CanRestoreOGDesc:
      uiText = 'Restore OpenGraph Description';
      nextDescriptionState = DescriptionTextStates.CanInsertParserDesc;
      textToInsert = ogExcerptText;
      break;
    default:
      return null;
  }

  return (
    <TextSwitchLinkComponent
      linkDescriptionText={uiText}
      textToInsert={textToInsert}
      nextDescriptionState={nextDescriptionState}
      actionCallback={actionCallback}
    />
  );
};
