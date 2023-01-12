import { Container } from '@mui/material';
import { styled } from '@mui/styles';

/**
 * A styled <Container> element for the main page layout.
 */
export const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: '7.5rem',
  [theme.breakpoints.down('sm')]: {
    marginTop: '5.5rem',
  },
}));
