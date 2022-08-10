import React, { useState } from 'react';
import { Grid, Collapse } from '@material-ui/core';
import { ApprovedCorpusItemScheduledSurfaceHistory } from '../../../api/generatedTypes';
import { useStyles } from './ScheduleHistory.styles';

import { Button } from '../../../_shared/components';
import { ScheduleHistoryEntries } from '../ScheduleHistoryEntries/ScheduleHistoryEntries';

interface ScheduleHistory {
  /**
   * Schedule history of a prospect already existing in the corpus
   */
  data: ApprovedCorpusItemScheduledSurfaceHistory[];

  isProspect?: boolean;
}
/**
 * This component renders details about the recent scheduled runs for a prospect already existing in the corpus.
 * Renders scheduled surface name, curator's name and the date scheduled for each scheduled run.
 * @param props
 */
export const ScheduleHistory: React.FC<ScheduleHistory> = (
  props
): JSX.Element => {
  const classes = useStyles();
  const { data, isProspect } = props;

  const [isShowingHistory, setIsShowingHistory] = useState(false);

  const toggleHistoryButtonText = isShowingHistory
    ? 'Hide recent scheduled runs'
    : 'View recent scheduled runs';

  return (
    <Grid container>
      <Button
        buttonType="positive"
        variant="text"
        onClick={() => {
          setIsShowingHistory(!isShowingHistory);
        }}
        className={classes.toggleHistoryButton}
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
