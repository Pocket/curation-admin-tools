import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

/**
 * Styles for the MiniScheduleCard component.
 */
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      marginBottom: '0.5rem',
      fontSize: '0.875rem',
    },
    content: {
      padding: '0.75rem',
    },
    link: {
      textDecoration: 'none',
      color: theme.palette.grey[900],
    },
    publisher: {
      marginTop: '0.25rem',
      fontWeight: 400,
      fontSize: '0.75rem',
      color: theme.palette.grey[600],
    },
    title: {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
    listItemIcon: {
      minWidth: '2rem',
    },
  })
);
