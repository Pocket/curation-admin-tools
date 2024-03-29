import { Typography } from '@mui/material';
import { styled } from '@mui/system';
import { curationPalette } from '../../theme';

/**
 * A styled product heading (e.g., "Collections") for the Header component.
 */
export const StyledProductHeading = styled(Typography)(({ theme }) => ({
  paddingLeft: '0.5rem',
  borderLeft: `1px solid ${curationPalette.lightGrey}`,
  [theme.breakpoints.down('sm')]: {
    marginTop: '0.75rem',
    borderLeft: 'none',
  },
}));
