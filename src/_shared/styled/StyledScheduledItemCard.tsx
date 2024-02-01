import { Card } from '@mui/material';
import { styled } from '@mui/system';

/**
 * A styled parent <Card> element that is used to display scheduld corpus items
 * on the Schedule page.
 */
export const StyledScheduledItemCard = styled(Card)(() => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  borderRadius: '8px',
}));
