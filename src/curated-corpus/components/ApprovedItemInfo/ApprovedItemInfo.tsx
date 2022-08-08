import React from 'react';
import { ApprovedCorpusItem } from '../../../api/generatedTypes';

interface ApprovedItemInfoProps {
  /**
   *
   */
  item: ApprovedCorpusItem;
}

export const ApprovedItemInfo: React.FC<ApprovedItemInfoProps> = (
  props
): JSX.Element => {
  const { item } = props;
  return <h4>This is curation item main info widget for {item.title}</h4>;
};
