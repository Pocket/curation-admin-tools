import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

/**
 * Styles for the ScheduleSummaryCOnnector component.
 */
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    heading: {
      fontSize: '1rem',
      fontWeight: 500,
      textTransform: 'capitalize',
      color: theme.palette.primary.main,
      padding: '0.75rem 0',
    },
  })
);
