import React, { useState } from 'react';
import { Grid } from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { ApprovedCorpusItemScheduledSurfaceHistory } from '../../../api/generatedTypes';
import { Button } from '../../../_shared/components';
import { ScheduleHistoryEntries } from '../';
import { StyledHistoryCollapse } from '../../../_shared/styled';

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
        startIcon={<EventNoteIcon />}
        sx={{
          paddingLeft: '0px',
        }}
      >
        {toggleHistoryButtonText}
      </Button>

      <StyledHistoryCollapse in={isShowingHistory} timeout="auto" unmountOnExit>
        <ScheduleHistoryEntries data={data} isProspect={isProspect} />
      </StyledHistoryCollapse>
    </Grid>
  );
};
