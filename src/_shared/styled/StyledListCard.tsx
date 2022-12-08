import { Card } from '@mui/material';
import { styled } from '@mui/styles';
import { curationPalette } from '../../theme';

/**
 * A styled <Card> element that is used wherever we display lists of Collection-related
 * entities, e.g. Authors or Partners.
 */
export const StyledListCard = styled(Card)(() => ({
  margin: '1rem auto',
  padding: '1.25rem 0.25rem',
  cursor: 'pointer',
  '&:active': {
    backgroundColor: curationPalette.neutral,
  },
}));
