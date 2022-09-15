import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

/**
 * TODO
 */
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dismissButton: {
      padding: '4px',
      color: theme.palette.secondary.main,
    },
  })
);
