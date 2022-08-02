import React, { useState } from 'react';
import { Grid, Typography, Collapse } from '@material-ui/core';
import { DateTime } from 'luxon';
import { ApprovedCorpusItemScheduledSurfaceHistory } from '../../../api/generatedTypes';
import { useStyles } from './ScheduleHistory.styles';
import { getCuratorNameFromLdap } from '../../helpers/helperFunctions';
import { ScheduledSurfaces } from '../../helpers/definitions';
import { Button } from '../../../_shared/components';

interface ScheduleHistory {
  data: ApprovedCorpusItemScheduledSurfaceHistory[];
}

export const ScheduleHistory: React.FC<ScheduleHistory> = (
  props
): JSX.Element => {
  const classes = useStyles();
  const { data } = props;

  const [isShowingHistory, setIsShowingHistory] = useState(false);

  const getScheduledSurfaceName = (surfaceGuid: string) => {
    return (
      ScheduledSurfaces.find((surface) => surface.guid === surfaceGuid)?.name ??
      'Unknown Surface'
    );
  };

  const getDisplayDate = (date: string) => {
    return DateTime.fromFormat(date, 'yyyy-MM-dd')
      .setLocale('en')
      .toLocaleString(DateTime.DATE_FULL);
  };

  return (
    <Grid container>
      <Grid item xs={12} className={classes.heading}>
        <Button
          buttonType="positive"
          variant="text"
          onClick={() => {
            setIsShowingHistory(!isShowingHistory);
          }}
        >
          {isShowingHistory
            ? 'hide recent scheduled runs'
            : 'view recent scheduled runs'}
        </Button>
      </Grid>

      <Collapse
        in={isShowingHistory}
        timeout="auto"
        unmountOnExit
        className={classes.collapse}
      >
        <Grid container>
          {data.map((item: ApprovedCorpusItemScheduledSurfaceHistory) => {
            return (
              <Grid
                key={item.externalId}
                item
                xs={12}
                className={classes.scheduledHistoryWrapper}
              >
                <Grid container justifyContent="space-between">
                  <Grid item xs={4}>
                    <Typography variant="body2">
                      {getScheduledSurfaceName(item.scheduledSurfaceGuid)}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2">
                      {getCuratorNameFromLdap(item.createdBy)}
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body2">
                      {getDisplayDate(item.scheduledDate)}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            );
          })}
        </Grid>
      </Collapse>
    </Grid>
  );
};
