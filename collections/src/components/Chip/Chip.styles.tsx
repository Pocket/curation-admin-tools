import { makeStyles, Theme } from '@material-ui/core/styles';
import { curationPalette } from '../../theme';

/**
 * Styles for the Chip component
 */
export const useStyles = makeStyles((theme: Theme) => ({
  /**
   * Default Chip styles - curation frontend neutral grey
   * background with white text.
   */
  root: {
    backgroundColor: curationPalette.neutral,
    color: curationPalette.white,
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    marginLeft: '0.5rem',
  },
  /**
   * Chip on the active tab: bright blue just like the tab label.
   */
  colorPrimary: {
    backgroundColor: curationPalette.blue,
  },
  colorSecondary: {
    backgroundColor: curationPalette.primary,
  },
}));
