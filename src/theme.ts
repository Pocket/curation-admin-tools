import { createTheme, Theme } from '@mui/material/styles';

/* Curation frontend colors */
export const curationPalette = {
  primary: '#008078', // dark green
  secondary: '#b24000', // red/brown
  neutral: '#737373', // dark grey
  blue: '#3668ff', // bright blue for active tabs
  white: '#FFFFFF',
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
});

// Theme customisations not yet transferred to the MUI 5 theme
// (and perhaps some, like the custom switch design, won't be transferred at all).

//   props: {
//     /* All the buttons in this project are flat. */
//     MuiButton: {
//       disableElevation: true,
//     },
//   },
//   overrides: {
//     /* Global styles for buttons. */
//     MuiButton: {
//       root: {
//         fontWeight: 500,
//         textTransform: 'none',
//         '&.Mui-disabled': {
//           border: 'none',
//         },
//       },
//
//       /* The default button; used for "Snooze" and "Edit" actions. */
//       contained: {
//         backgroundColor: curationPalette.neutral,
//         color: curationPalette.white,
//         '&:hover': {
//           backgroundColor: curationPalette.neutral,
//         },
//       },
//
//       containedPrimary: {
//         border: `1px solid ${curationPalette.primary}`,
//         '&:hover': {
//           border: `1px solid ${curationPalette.primaryDark}`,
//         },
//       },
//
//       containedSecondary: {
//         border: `1px solid ${curationPalette.secondary}`,
//         '&:hover': {
//           border: `1px solid ${curationPalette.secondaryDark}`,
//         },
//       },
//
//       /* Global styles for outlined buttons. */
//       outlined: {
//         backgroundColor: curationPalette.white,
//         border: `2px solid ${curationPalette.neutral}`,
//       },
//
//       /* The outlined button; used for the "Log out" button in the header. */
//       outlinedPrimary: {
//         border: `2px solid ${curationPalette.primary}`,
//         '&:hover': {
//           border: `2px solid ${curationPalette.primaryDark}`,
//         },
//         '&.Mui-disabled': {
//           backgroundColor: curationPalette.neutralVeryLight,
//           border: `2px solid ${curationPalette.neutralLight}`,
//         },
//       },
//
//       /**
//        *  Outlined button in secondary (red/brown) colour; not currently used
//        *  but provided here for completeness.
//        */
//       outlinedSecondary: {
//         border: `2px solid ${curationPalette.secondary}`,
//         '&:hover': {
//           border: `2px solid ${curationPalette.secondaryDark}`,
//         },
//       },
//     },
//
//     /* The divider is slightly darker than the default MUI one. */
//     MuiDivider: {
//       root: {
//         backgroundColor: curationPalette.neutral,
//       },
//     },
//
//     /* An iOS-style switch */
//     MuiSwitch: {
//       root: {
//         width: 80,
//         height: 48,
//         padding: 8,
//         '&.Mui-disabled': {
//           '& + $track': {
//             opacity: '0.2 !important',
//             cursor: 'not-allowed',
//           },
//         },
//         '&.Mui-checked': {
//           '&$switchBase': {
//             transform: 'translateX(32px)',
//           },
//           '& $thumb': {
//             backgroundColor: curationPalette.white,
//             backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="-2 0 20 20" width="20"><path d="M0 0h24v24H0z" fill="none"/><path fill="${encodeURIComponent(
//               curationPalette.primary
//             )}" d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>')`,
//           },
//           '& + $track': {
//             background: curationPalette.primary,
//             opacity: '1 !important',
//           },
//         },
//       },
//       switchBase: {
//         padding: 11,
//         color: curationPalette.white,
//         '& $thumb': {
//           backgroundColor: curationPalette.white,
//           backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="22" viewBox="0 0 20 20" width="21"><path fill="${encodeURIComponent(
//             curationPalette.neutral
//           )}" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg>')`,
//         },
//       },
//       thumb: {
//         width: 26,
//         height: 26,
//         backgroundColor: curationPalette.white,
//       },
//       track: {
//         backgroundColor: curationPalette.neutral,
//         opacity: '1',
//         borderRadius: 20,
//         position: 'relative',
//       },
//     },
//   },

export default theme;
