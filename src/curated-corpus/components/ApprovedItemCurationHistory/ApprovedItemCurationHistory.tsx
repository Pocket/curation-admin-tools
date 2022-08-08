import React from 'react';
import { ApprovedCorpusItem } from '../../../api/generatedTypes';

interface ApprovedItemCurationHistoryProps {
  /**
   *
   */
  item: ApprovedCorpusItem;
}

export const ApprovedItemCurationHistory: React.FC<
  ApprovedItemCurationHistoryProps
> = (props): JSX.Element => {
  const { item } = props;

  return <h4>Curation history is listed here for {item.title}</h4>;
};
