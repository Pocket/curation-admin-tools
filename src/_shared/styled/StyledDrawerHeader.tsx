import { Box } from '@mui/material';
import { styled } from '@mui/system';

/**
 * A styled drawer header element for the Header component.
 */
export const StyledDrawerHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  justifyContent: 'flex-end',
}));
