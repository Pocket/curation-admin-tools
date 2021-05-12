import { makeStyles, Theme } from '@material-ui/core/styles';
import { curationPalette } from '../../theme';

/**
 * Styles for the ImageUpload component
 */
export const useStyles = makeStyles((theme: Theme) => ({
  image: {
    borderRadius: '0.25rem',
    cursor: 'pointer',
  },
  dropzone: {
    position: 'relative',
    width: '100%',
    minHeight: '250px',
    backgroundColor: curationPalette.white,
    border: 'dashed',
    borderColor: theme.palette.primary.light,
    boxSizing: 'border-box',
    cursor: 'pointer',
    overflow: 'hidden',
  },
}));
