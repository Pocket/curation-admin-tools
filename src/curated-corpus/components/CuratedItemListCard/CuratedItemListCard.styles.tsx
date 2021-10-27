import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

/**
 * Styles for the CuratedItemListCard component.
 */
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    actions: {
      margin: 'auto',
    },
    content: {
      padding: '0.5rem',
    },
    flexGrow: {
      flexGrow: 1,
    },
    link: {
      textDecoration: 'none',
      color: theme.palette.grey[900],
    },
    list: {
      borderBottom: `1px solid ${theme.palette.grey[300]}`,
    },
    listItemIcon: {
      minWidth: '2rem',
    },
    publisher: {
      marginTop: '0.25rem',
      fontWeight: 400,
      fontSize: '0.875rem',
      color: theme.palette.grey[600],
    },
    title: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    topic: {
      textTransform: 'capitalize',
    },
    status: {
      textTransform: 'capitalize',
    },
  })
);
