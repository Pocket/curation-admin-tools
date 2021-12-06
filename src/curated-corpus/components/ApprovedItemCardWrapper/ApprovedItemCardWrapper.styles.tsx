import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

/**
 * Styles for the ApprovedItemCardWrapper component.
 */
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    },
    actions: {
      margin: 'auto',
    },
  })
);
