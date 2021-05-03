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
    fontWeight: 400,
    marginLeft: '0.5rem',
  },
  /**
   * Chip on the active tab: curation green
   */
  colorPrimary: {
    backgroundColor: curationPalette.primary,
  },
  colorSecondary: {
    backgroundColor: curationPalette.primary,
  },
}));
