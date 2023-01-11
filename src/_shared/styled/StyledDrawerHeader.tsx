import { Box } from '@mui/material';
import { styled } from '@mui/styles';

/**
 * A styled drawer header element for the Header component.
 */
export const StyledDrawerHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));
