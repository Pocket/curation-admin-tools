import { CardActions } from '@mui/material';
import { styled } from '@mui/styles';

/**
 * A styled <CardActions> element for the cards on the Corpus and Schedule pages
 * (Curated Corpus).
 */
export const StyledCardActions = styled(CardActions)(({ theme }) => ({
  margin: 'auto',
  '& button': {
    marginLeft: '0 !important',
  },
}));
