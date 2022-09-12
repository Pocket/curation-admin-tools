import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

/**
 * Styles for the DuplicateProspectModal component.
 */
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '800px',
    },
    link: {
      color: theme.palette.primary.main,
      textDecoration: 'none',
    },
    buttonContainer: {
      marginTop: '1.25rem',
      textAlign: 'center',
    },
    [theme.breakpoints.down('sm')]: {
      root: {
        width: '100%',
      },
    },
  })
);
