import { styled } from '@mui/styles';
import { Link } from 'react-router-dom';
import { curationPalette } from '../../theme';
import { config } from '../../config';

/**
 * A styled product heading link (e.g., "Collections") for the Header component.
 */
export const StyledProductHeadingLink = styled(Link)(({ theme }) => ({
  color: config.isProduction
    ? curationPalette.pocketBlack
    : curationPalette.white,
  textDecoration: 'none',
  whiteSpace: 'nowrap',
}));
