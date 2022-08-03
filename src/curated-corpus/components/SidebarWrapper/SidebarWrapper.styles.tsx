import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

/**
 * Styles for the SidebarWrapper component.
 */
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: 'white',
      position: 'sticky',
      top: 0,
      bottom: 0,
      paddingTop: '0.5rem',
      paddingBottom: '0.5rem',
      zIndex: 5,
    },
  })
);
