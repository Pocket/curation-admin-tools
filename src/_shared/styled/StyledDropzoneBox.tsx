import { styled } from '@mui/system';
import { Box } from '@mui/material';
import { curationPalette } from '../../theme';

/**
 * Style tweaks to how we display the area to drag and drop images for uploading
 * to collections/stories/partners/etc.
 */
export const StyledDropzoneBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  minHeight: '250px',
  backgroundColor: curationPalette.white,
  border: 'dashed',
  borderColor: theme.palette.primary.light,
  boxSizing: 'border-box',
  cursor: 'pointer',
  overflow: 'hidden',
}));
