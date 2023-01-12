import { Collapse } from '@mui/material';
import { styled } from '@mui/styles';

/**
 * A styled <Collapse> element for the "Recently scheduled" info for curated items.
 * These styles are only used in one place - they're here to take advantage of a pre-set
 * theme colour that is inaccessible in a `sx` prop (inline styles).
 */
export const StyledHistoryCollapse = styled(Collapse)(({ theme }) => ({
  marginTop: '0.5rem',
  border: `solid 1px ${theme.palette.secondary.light}`,
  borderRadius: '5px',
  width: '100%',
}));
