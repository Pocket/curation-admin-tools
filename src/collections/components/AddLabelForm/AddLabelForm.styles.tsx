import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

/**
 * Styles for the AddLabelForm component.
 */
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '800px',
    },
    [theme.breakpoints.down('sm')]: {
      root: {
        width: '100%',
      },
    },
  })
);
