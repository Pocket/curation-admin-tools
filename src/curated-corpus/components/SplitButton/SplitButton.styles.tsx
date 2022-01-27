import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

/**
 * Styles for the SplitButton component.
 */
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    optionNameSmall: {
      minWidth: '4rem',
    },
    optionNameMedium: {
      minWidth: '9rem',
    },
  })
);
