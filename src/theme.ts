import { createTheme, Theme } from '@mui/material/styles';

/* Curation frontend colors */
export const curationPalette = {
  primary: '#008078', // dark green
  secondary: '#b24000', // red/brown
  neutral: '#737373', // dark grey
  blue: '#3668ff', // bright blue for active tabs
  white: '#FFFFFF',
  lightGrey: '#cccccc', // for borders here and there
  pocketBlack: '#1a1a1a', // for not-quite-black text
  solidPink: '#C50042',
  translucentPink: '#C50042CC',
};

const theme: Theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1024,
      xl: 1280,
    },
  },
  /* The font used is the default font on getpocket.com */
  typography: {
    fontFamily: [
      'Graphik Web',
      'proxima-nova',
      'Helvetica Neue',
      'Helvetica',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  palette: {
    /* The primary color palette: dark green + white for contrasting text. */
    primary: {
      main: curationPalette.primary,
      contrastText: curationPalette.white,
    },
    /* The secondary color palette: red/brown + white for contrasting text. */
    secondary: {
      main: curationPalette.secondary,
      contrastText: curationPalette.white,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        /* Global styles for buttons. */
        root: {
          fontWeight: 500,
          textTransform: 'none',
          '&.Mui-disabled': {
            border: 'none',
          },
        },

        /* Global styles for outlined buttons. */
        outlined: {
          backgroundColor: curationPalette.white,
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
      },
    },
    /* The divider is slightly darker than the default MUI one. */
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: curationPalette.neutral,
        },
      },
    },
  },
});

export default theme;
