import React, { useEffect, useState } from 'react';
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
export interface SetExceptTextInterface {
  (textToInsert: string): void;
}

interface TextSwitchLinkParams {
  parserItemExcerptText: string;
  ogExcerptText: string;
  updateExcerptText: SetExceptTextInterface;
}

export const TextSwitchLink = ({
  parserItemExcerptText,
  ogExcerptText,
  updateExcerptText,
}: TextSwitchLinkParams): JSX.Element | null => {
  const manageDescriptionStateForServerInput = () => {
    // Constructs the text insertion link state based on data from the server
    if (ogExcerptText && parserItemExcerptText) {
      if (ogExcerptText === parserItemExcerptText) {
        // Both fields match, so No UI needed at all
        setDescriptionState(DescriptionTextStates.MatchingDescriptions);
      } else {
        setDescriptionState(DescriptionTextStates.CanInsertParserDesc);
      }
    } else {
      setDescriptionState(DescriptionTextStates.IncompleteDescription);
    }
  };

  useEffect(manageDescriptionStateForServerInput, [
    ogExcerptText,
    parserItemExcerptText,
  ]);

  const [descriptionState, setDescriptionState] =
    useState<DescriptionTextStates>(
      DescriptionTextStates.IncompleteDescription
    );

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

  const actionCallback = (
    textToInsert: string,
    newDescriptionState: DescriptionTextStates
  ) => {
    setDescriptionState(newDescriptionState);
    updateExcerptText(textToInsert);
  };

  return (
    <TextSwitchLinkComponent
      linkDescriptionText={uiText}
      textToInsert={textToInsert}
      nextDescriptionState={nextDescriptionState}
      actionCallback={actionCallback}
    />
  );
};
