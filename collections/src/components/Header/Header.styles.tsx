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
    paddingRight: '0.25rem',
  },
  logoMobile: {
    width: '1.25rem',
    paddingTop: '0.375rem',
  },
  product: {
    fontSize: '1.25rem',
    paddingLeft: '0.5rem',
    borderLeft: `1px solid ${theme.palette.grey[400]}`,
    [theme.breakpoints.down('sm')]: {
      marginTop: '0.75rem',
      borderLeft: 'none',
    },
  },
  productLink: {
    color: '#222222',
    textDecoration: 'none',
  },
  drawer: {
    flexShrink: 0,
  },
  drawerPaper: {
    width: 280,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  menuList: {
    padding: '0.5rem 1rem',
  },
  menuLink: {
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
  },
  appBarList: {
    display: 'flex',
    flexDirection: 'row',
    padding: 0,
  },
  appBarLink: {
    color: '#000',
  },
}));
