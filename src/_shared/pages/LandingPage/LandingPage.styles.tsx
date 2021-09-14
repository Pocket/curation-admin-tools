import { makeStyles, Theme } from '@material-ui/core/styles';

/**
 * Styles for the LandingPage component
 */
export const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.primary.main,
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: 'none',
  },
}));
