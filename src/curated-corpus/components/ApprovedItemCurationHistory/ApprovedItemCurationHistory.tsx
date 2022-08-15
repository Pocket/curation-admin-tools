import React from 'react';
import { ApprovedCorpusItem } from '../../../api/generatedTypes';
import { ScheduleHistoryEntries } from '../ScheduleHistoryEntries/ScheduleHistoryEntries';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@material-ui/core';
import FaceIcon from '@material-ui/icons/Face';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import { getCuratorNameFromLdap } from '../../helpers/helperFunctions';
import { DateTime } from 'luxon';

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

  return (
    <>
      <h2>Curation History</h2>
      <List dense>
        <ListItem>
          <ListItemIcon>
            <ThumbUpIcon />
          </ListItemIcon>
          <ListItemText secondary={item.status} />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <FaceIcon />
          </ListItemIcon>
          <ListItemText
            primary={getCuratorNameFromLdap(item.createdBy)}
            secondary={DateTime.fromSeconds(item.createdAt).toFormat(
              'MMMM dd, yyyy'
            )}
          />
        </ListItem>
      </List>
      <h2>Schedule</h2>
      <Typography>
        Note: up to ten most recent entries are displayed below.
      </Typography>
      <ScheduleHistoryEntries data={item.scheduledSurfaceHistory} />
    </>
  );
};
