import { Chip } from '@mui/material';
import { styled } from '@mui/styles';

/**
 * A custom styled <Chip> element. Currently, used to display labels on CollectionListCard and CollectionInfo components.
 */
export const StyledChipComponent = styled(Chip)(() => ({
  '&.MuiChip-root': {
    color: 'white',
    background: `linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(0,128,120,0.5942577714679622) 0%)`,
  },
  '&.MuiChip-root .MuiChip-icon': {
    color: 'white',
  },
}));
