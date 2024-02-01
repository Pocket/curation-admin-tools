import { Card } from '@mui/material';
import { styled } from '@mui/system';

/**
 * A styled parent <Card> element that is used to display approved corpus items
 * on the Corpus and Schedule pages.
 */
export const StyledCorpusItemCard = styled(Card)(() => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
}));
