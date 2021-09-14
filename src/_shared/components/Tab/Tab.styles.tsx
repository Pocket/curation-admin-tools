import { makeStyles, Theme } from '@material-ui/core/styles';

/**
 * Styles for the TabLink component.
 */
export const useStyles = makeStyles((theme: Theme) => ({
  root: {
    textTransform: 'none',
    fontWeight: 400,
    fontSize: '1rem',
  },
  /**
   * Don't stretch the tab label element the entire width of the tab
   * so that the Chip with the number of articles is better placed
   * alongside the label.
   */
  wrapper: {
    width: 'auto',
  },
}));
