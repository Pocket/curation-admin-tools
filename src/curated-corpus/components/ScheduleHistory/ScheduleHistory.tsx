import React from 'react';
import { Card, Grid, Typography } from '@material-ui/core';
import { DateTime } from 'luxon';
import { ApprovedCorpusItemScheduledSurfaceHistory } from '../../../api/generatedTypes';
import { useStyles } from './ScheduleHistory.styles';
import { getCuratorNameFromLdap } from '../../helpers/helperFunctions';
import { ScheduledSurfaces } from '../../helpers/definitions';

interface ScheduleHistory {
  data: ApprovedCorpusItemScheduledSurfaceHistory[];
}

export const ScheduleHistory: React.FC<ScheduleHistory> = (
  props
): JSX.Element => {
  const classes = useStyles();
  const { data } = props;

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
    <Card className={classes.root}>
      <Grid container>
        <Grid item xs={12}>
          <Typography className={classes.heading} variant="h4">
            Schedule History
          </Typography>
        </Grid>
        {data.map((item: ApprovedCorpusItemScheduledSurfaceHistory) => {
          return (
            <Grid key={item.externalId} container>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  {getScheduledSurfaceName(item.scheduledSurfaceGuid)}
                </Typography>
                <Typography variant="body2">
                  {getCuratorNameFromLdap(item.createdBy)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2">
                  {getDisplayDate(item.scheduledDate)}
                </Typography>
              </Grid>
              <hr style={{ width: '100%' }} />
            </Grid>
          );
        })}
      </Grid>
    </Card>
  );
};
