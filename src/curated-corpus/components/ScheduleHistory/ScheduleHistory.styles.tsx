import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

/**
 * Styles for the ScheduleHistory component.
 */
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    collapse: {
      marginTop: '0.5rem',
      border: `solid 1px ${theme.palette.secondary.light}`,
      borderRadius: '5px',
      width: '100%',
    },
    toggleHistoryButton: {
      paddingLeft: '0px',
    },
  })
);
