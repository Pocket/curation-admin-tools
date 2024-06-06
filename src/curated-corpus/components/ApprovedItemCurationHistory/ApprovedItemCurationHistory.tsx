import React from 'react';
import { ApprovedCorpusItem } from '../../../api/generatedTypes';
import { ScheduleHistoryEntries } from '../ScheduleHistoryEntries/ScheduleHistoryEntries';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import FaceIcon from '@mui/icons-material/Face';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { getCuratorNameFromLdap } from '../../helpers/helperFunctions';
import { DateTime } from 'luxon';

interface ApprovedItemCurationHistoryProps {
  /**
   * The Approved Corpus Item (with history!)
   */
  item: ApprovedCorpusItem;
}

/**
 * This component displays a summary of a curated item's history.
 * This includes who and when initially added it to the corpus
 * as well as recent entries on one or more scheduled
 * surfaces.
 *
 * The data passed from CuratedItemPage uses default filters on the
 * scheduled history for a corpus item, which means we get up to
 * ten most recent entries from the history. This has a good chance
 * of being revised in the future!
 *
 * @param props
 * @constructor
 */
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
              'MMMM dd, yyyy',
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
