import React, { useState } from 'react';
import EventNoteIcon from '@material-ui/icons/EventNote';
import { Grid, Collapse } from '@material-ui/core';
import { ApprovedCorpusItemScheduledSurfaceHistory } from '../../../api/generatedTypes';
import { useStyles } from './ScheduleHistory.styles';

import { Button } from '../../../_shared/components';
import { ScheduleHistoryEntries } from '../ScheduleHistoryEntries/ScheduleHistoryEntries';

interface ScheduleHistory {
  /**
   * Schedule history of an already existing item in the corpus
   */
  data: ApprovedCorpusItemScheduledSurfaceHistory[];

  /**
   * flag to know whether the schedule history is being shown for a prospect item or not
   */
  isProspect?: boolean;
}
/**
 * This is a wrapper component for ScheduledHistoryEntries component.
 * @param props
 */
export const ScheduleHistory: React.FC<ScheduleHistory> = (
  props
): JSX.Element => {
  const classes = useStyles();
  const { data, isProspect } = props;

  const [isShowingHistory, setIsShowingHistory] = useState(false);

  const toggleHistoryButtonText = isShowingHistory
    ? 'Hide recently scheduled'
    : 'View recently scheduled';

  return (
    <Grid container>
      <Button
        buttonType="positive"
        variant="text"
        onClick={() => {
          setIsShowingHistory(!isShowingHistory);
        }}
        className={classes.toggleHistoryButton}
        startIcon={<EventNoteIcon />}
      >
        {toggleHistoryButtonText}
      </Button>

      <Collapse
        in={isShowingHistory}
        timeout="auto"
        unmountOnExit
        className={classes.collapse}
      >
        <ScheduleHistoryEntries data={data} isProspect={isProspect} />
      </Collapse>
    </Grid>
  );
};
