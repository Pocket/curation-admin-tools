import { Link } from '@mui/material';
import { styled } from '@mui/system';

/**
 * A styled link to elsewhere in the app that wraps around a MUI Card element
 * so that the entire Card area is clickable.
 */
export const StyledCardLink = styled(Link)(() => ({
  textDecoration: 'none',
  padding: '1.25rem 0',
})) as typeof Link;
