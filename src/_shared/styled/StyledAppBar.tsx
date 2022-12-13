import { AppBar } from '@mui/material';
import { styled } from '@mui/styles';

/**
 * A styled <AppBar> element for the Header component.
 */
export const StyledAppBar = styled(AppBar)(({ theme }) => ({
  padding: '0.5rem 0 0.25rem 0',
  boxShadow: '0px 4px 10px rgba(148, 148, 148, 0.3)',
  [theme.breakpoints.down('sm')]: {
    padding: 0,
  },
  [theme.breakpoints.up('md')]: {
    padding: '0.75rem 0',
  },
}));
