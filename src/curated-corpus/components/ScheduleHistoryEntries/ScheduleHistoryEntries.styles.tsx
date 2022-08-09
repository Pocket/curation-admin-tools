import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

/**
 * Styles for the ScheduleHistory component.
 */
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    scheduledHistoryWrapper: {
      margin: '0.5em',
    },
    narrowCard: {
      flexDirection: 'column',
      alignContent: 'flex-end',
    },
    wideCard: {
      flexDirection: 'row',
    },
  })
);
