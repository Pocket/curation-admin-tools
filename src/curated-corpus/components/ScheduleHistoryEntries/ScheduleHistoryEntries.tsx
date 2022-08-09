import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import { DateTime } from 'luxon';
import { ApprovedCorpusItemScheduledSurfaceHistory } from '../../../api/generatedTypes';
import { useStyles } from './ScheduleHistoryEntries.styles';
import {
  getCuratorNameFromLdap,
  getScheduledSurfaceName,
} from '../../helpers/helperFunctions';

interface ScheduleHistoryEntries {
  /**
   * Schedule history of a prospect already existing in the corpus
   */
  data: ApprovedCorpusItemScheduledSurfaceHistory[];
}
/**
 * This component renders details about the recent scheduled runs for a prospect already existing in the corpus.
 * Renders scheduled surface name, curator's name and the date scheduled for each scheduled run.
 * @param props
 */
export const ScheduleHistoryEntries: React.FC<ScheduleHistoryEntries> = (
  props
): JSX.Element => {
  const classes = useStyles();
  const { data } = props;

  const getDisplayDate = (date: string) => {
    return DateTime.fromFormat(date, 'yyyy-MM-dd')
      .setLocale('en')
      .toLocaleString(DateTime.DATE_FULL);
  };

  return (
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
  );
};
