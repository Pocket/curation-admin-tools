import { Typography } from '@mui/material';
import { styled } from '@mui/system';
import { curationPalette } from '../../theme';

/**
 * A styled product heading (e.g., "Collections") for the Header component.
 */
export const StyledProductHeading = styled(Typography)(({ theme }) => ({
  paddingLeft: '0.5rem',
  borderLeft: `1px solid ${curationPalette.lightGrey}`,
  margin: 0,
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('sm')]: {
    marginTop: 0,
    borderLeft: 'none',
  },
}));
