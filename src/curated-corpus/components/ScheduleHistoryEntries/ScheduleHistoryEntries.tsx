import React from 'react';
import { Grid, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import { ApprovedCorpusItemScheduledSurfaceHistory } from '../../../api/generatedTypes';
import {
  getCuratorNameFromLdap,
  getScheduledSurfaceName,
} from '../../helpers/helperFunctions';

interface ScheduleHistoryEntries {
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
 * This component renders recent scheduled runs details of an already existing item in the corpus.
 * Includes scheduled surface name, curator's name and the date scheduled for each scheduled run.
 * @param props
 */
export const ScheduleHistoryEntries: React.FC<ScheduleHistoryEntries> = (
  props
): JSX.Element => {
  const { data, isProspect } = props;

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
            container
            sx={{
              margin: '0.5em',
            }}
          >
            <Grid item xs={4}>
              <Typography variant="body2">
                {getScheduledSurfaceName(item.scheduledSurfaceGuid)}
              </Typography>
            </Grid>
            <Grid item xs={8}>
              <Grid
                container
                sx={
                  isProspect
                    ? {
                        flexDirection: 'row',
                      }
                    : {
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                      }
                }
              >
                <Grid item xs>
                  <Typography variant="body2">
                    {getCuratorNameFromLdap(item.createdBy)}
                  </Typography>
                </Grid>
                <Grid item xs>
                  <Typography variant="body2">
                    {getDisplayDate(item.scheduledDate)}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        );
      })}
    </Grid>
  );
};
