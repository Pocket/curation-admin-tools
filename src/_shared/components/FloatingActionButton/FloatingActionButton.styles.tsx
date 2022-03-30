import { createStyles, makeStyles } from '@material-ui/core/styles';

/**
 * Styles for Floating Action Button component.
 */
export const useStyles = makeStyles(() =>
  createStyles({
    bottomRightFloating: {
      margin: 0,
      top: 'auto',
      right: 50,
      bottom: 20,
      left: 'auto',
      position: 'fixed',
    },
  })
);
