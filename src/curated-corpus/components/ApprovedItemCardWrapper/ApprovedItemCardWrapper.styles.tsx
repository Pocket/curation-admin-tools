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
      position: 'relative',
    },
    actions: {
      margin: 'auto',
      '& button': {
        marginLeft: '0 !important',
      },
    },
    link: {
      color: theme.palette.primary.main,
      textDecoration: 'none',
    },
  })
);
