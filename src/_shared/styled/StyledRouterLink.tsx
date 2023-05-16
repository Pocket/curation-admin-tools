import { Link } from 'react-router-dom';
import { styled } from '@mui/system';

/**
 * A styled link for React Router links (for example, icons on the Landing page)
 */
export const StyledRouterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: 'none',
  padding: theme.spacing(4),
  textAlign: 'center',
})) as typeof Link;
