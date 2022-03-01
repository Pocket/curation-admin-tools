import { createStyles, makeStyles } from '@material-ui/core/styles';

/**
 * Styles for the ApprovedItemCardWrapper component.
 */
export const useStyles = makeStyles(() =>
  createStyles({
    root: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
    },
    actions: {
      margin: 'auto',
    },
  })
);
