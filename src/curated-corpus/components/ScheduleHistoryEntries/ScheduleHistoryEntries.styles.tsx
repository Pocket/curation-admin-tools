import { createStyles, makeStyles } from '@material-ui/core/styles';

/**
 * Styles for the ScheduleHistoryEntries component.
 */
export const useStyles = makeStyles(() =>
  createStyles({
    scheduledHistoryWrapper: {
      margin: '0.5em',
    },
    narrowCard: {
      flexDirection: 'column',
      alignItems: 'flex-end',
    },
    wideCard: {
      flexDirection: 'row',
    },
  })
);
