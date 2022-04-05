import { createStyles, makeStyles } from '@material-ui/core/styles';

/**
 * Styles for Floating Action Button component.
 */
export const useStyles = makeStyles(() =>
  createStyles({
    bottomRightFloating: {
      position: 'fixed',
      margin: '0rem',
      top: 'auto',
      right: '1.5rem',
      bottom: '1.5rem',
      left: 'auto',
    },
  })
);
