import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

/**
 * Styles for elements on the Schedule page.
 */
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    heading: {
      fontSize: '1.5rem',
      fontWeight: 500,
      textTransform: 'capitalize',
      color: theme.palette.primary.main,
    },
  })
);
