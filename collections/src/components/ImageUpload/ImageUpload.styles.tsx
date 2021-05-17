import { makeStyles, Theme } from '@material-ui/core/styles';
import { curationPalette } from '../../theme';

/**
 * Styles for the ImageUpload component
 */
export const useStyles = makeStyles((theme: Theme) => ({
  image: {
    cursor: 'pointer',
  },
  placeholder: {
    cursor: 'pointer',
    border: 'dashed',
    borderColor: theme.palette.grey[400],
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
