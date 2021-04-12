import { makeStyles, Theme } from '@material-ui/core/styles';
import { curationPalette } from '../../theme';

/**
 * Styles for the Header component
 */
export const useStyles = makeStyles((theme: Theme) => ({
  appBar: {
    padding: '0.5rem 0 0.25rem 0',
    backgroundColor: curationPalette.white,
    boxShadow: '0px 4px 10px rgba(148, 148, 148, 0.3)',
    [theme.breakpoints.down('sm')]: {
      padding: 0,
    },
    [theme.breakpoints.up('md')]: {
      padding: '0.75rem 0',
    },
  },
  logo: {
    width: '100px',
  },
  logoMobile: {
    width: '20px',
    paddingTop: '4px',
  },
}));
