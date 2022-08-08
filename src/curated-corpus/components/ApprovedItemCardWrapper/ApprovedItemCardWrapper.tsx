import React from 'react';
import { Card, CardActions } from '@material-ui/core';
import { useStyles } from './ApprovedItemCardWrapper.styles';
import { ApprovedCorpusItem } from '../../../api/generatedTypes';
import { Button } from '../../../_shared/components';
import { ApprovedItemListCard } from '../ApprovedItemListCard/ApprovedItemListCard';
import { Link } from 'react-router-dom';

interface ApprovedItemCardWrapperProps {
  /**
   * An object with everything approved curated item-related in it.
   */
  item: ApprovedCorpusItem;

  onReject: VoidFunction;

  onSchedule: VoidFunction;

  onEdit: VoidFunction;
}

export const ApprovedItemCardWrapper: React.FC<ApprovedItemCardWrapperProps> = (
  props
): JSX.Element => {
  const classes = useStyles();
  const { item, onEdit, onReject, onSchedule } = props;

  return (
    <Card className={classes.root}>
      <ApprovedItemListCard item={item} />

      <CardActions className={classes.actions}>
        <Button buttonType="positive" variant="text" onClick={onSchedule}>
          Schedule
        </Button>
        <Button buttonType="negative" variant="text" onClick={onReject}>
          Reject
        </Button>
        <Button buttonType="positive" variant="text" onClick={onEdit}>
          Edit
        </Button>
      </CardActions>
      <Link
        to={
          /* temp temp temp! */ `/curated-corpus/corpus/item/${item.externalId}`
        }
      >
        View
      </Link>
    </Card>
  );
};
