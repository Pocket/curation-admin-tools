import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

/**
 * Styles for the ScheduleSummaryConnector component.
 */
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: 'white',
      position: 'sticky',
      top: 0,
      bottom: 0,
      paddingTop: '0.5rem',
      paddingBottom: '0.5rem',
      zIndex: 5,
    },
    heading: {
      fontSize: '1rem',
      fontWeight: 500,
      textTransform: 'capitalize',
      color: theme.palette.primary.main,
      padding: '0.75rem 0',
    },
  })
);
