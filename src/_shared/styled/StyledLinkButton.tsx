import { Link } from '@mui/material';
import { styled } from '@mui/styles';

/**
 * A link within a button, e.g. "View" to go to the Corpus Item page.
 */
export const StyledLinkButton = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: 'none',
})) as typeof Link;
