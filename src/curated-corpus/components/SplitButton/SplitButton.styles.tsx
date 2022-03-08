import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

/**
 * Styles for the SplitButton component.
 */
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    popper: {
      // this prevents the dropdown from being covered by schedule item card
      zIndex: 1,
    },

    optionNameSmall: {
      minWidth: '4rem',
    },
    optionNameMedium: {
      minWidth: '9rem',
    },
  })
);
