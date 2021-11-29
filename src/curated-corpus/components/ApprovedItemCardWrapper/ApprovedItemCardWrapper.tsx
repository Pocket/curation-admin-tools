import React from 'react';
import { Card, CardActions } from '@material-ui/core';
import { useStyles } from './ApprovedItemCardWrapper.styles';
import { ApprovedCuratedCorpusItem } from '../../api/curated-corpus-api/generatedTypes';
import { Button } from '../../../_shared/components';
import { ApprovedItemListCard } from '../ApprovedItemListCard/ApprovedItemListCard';

interface ApprovedItemCardWrapperProps {
  /**
   * An object with everything approved curated item-related in it.
   */
  item: ApprovedCuratedCorpusItem;

  onSchedule: () => void;
}

export const ApprovedItemCardWrapper: React.FC<ApprovedItemCardWrapperProps> = (
  props
): JSX.Element => {
  const classes = useStyles();
  const { item, onSchedule } = props;

  return (
    <Card className={classes.root}>
      <ApprovedItemListCard item={item} />

      <CardActions className={classes.actions}>
        <Button buttonType="positive" variant="text" onClick={onSchedule}>
          Schedule
        </Button>
        <Button buttonType="negative" variant="text">
          Reject
        </Button>
        <Button buttonType="positive" variant="text">
          Edit
        </Button>
      </CardActions>
    </Card>
  );
};
