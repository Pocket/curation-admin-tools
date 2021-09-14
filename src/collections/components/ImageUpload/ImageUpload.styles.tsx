import { makeStyles, Theme } from '@material-ui/core/styles';
import { curationPalette } from '../../../theme';

/**
 * Styles for the ImageUpload component
 */
export const useStyles = makeStyles((theme: Theme) => ({
  image: {
    cursor: 'pointer',
  },
  placeholder: {
    cursor: 'pointer',
    borderBottom: `1px solid ${theme.palette.grey[300]}`,
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
  uploadIcon: {
    paddingRight: '0.5rem',
    [theme.breakpoints.down('sm')]: {
      paddingRight: 0,
    },
  },
  cardActions: {
    justifyContent: 'center',
  },
}));
