import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

/**
 * Styles for the ExistingProspectCard component.
 */
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '0.5rem',
      display: 'flex',
      flexDirection: 'column',
      marginBottom: '2rem',
    },
    actions: {
      margin: 'auto',
    },
    image: {
      borderRadius: 4,
      border: '1px solid lightgray',
    },
    link: {
      textDecoration: 'none',
      color: theme.palette.primary.main,
      padding: '1.25 rem 0',
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    subtitle: {
      fontWeight: 400,
    },
    [theme.breakpoints.down('sm')]: {
      title: {
        fontSize: '1rem',
      },
    },
  })
);