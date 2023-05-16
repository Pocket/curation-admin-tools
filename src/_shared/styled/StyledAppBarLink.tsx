import { styled } from '@mui/system';
import { Link } from 'react-router-dom';
import { curationPalette } from '../../theme';
import { config } from '../../config';

/**
 * A styled link (e.g., "Search") for the mobile menu (Drawer) component.
 */
export const StyledAppBarLink = styled(Link)(({ theme }) => ({
  color: config.isProduction
    ? curationPalette.pocketBlack
    : curationPalette.white,
  textDecoration: 'none',
}));
