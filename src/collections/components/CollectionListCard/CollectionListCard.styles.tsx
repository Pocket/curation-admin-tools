import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

/**
 * Styles for the CollectionListCard component.
 */
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: 'auto',
      padding: '1.25rem 0.25rem',
      border: 0,
      borderBottom: `1px solid ${theme.palette.grey[300]}`,
      cursor: 'pointer',
      '&:active': {
        backgroundColor: theme.palette.grey[300],
      },
    },
    image: {
      borderRadius: 4,
    },
    link: {
      textDecoration: 'none',
      padding: '1.25 rem 0',
    },
    iabAvatar: {
      height: theme.spacing(3),
      width: theme.spacing(3),
      fontSize: '0.875rem',
      backgroundColor: '#ffffff',
      border: `1px solid ${theme.palette.primary.light}`,
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    subtitle: {
      fontWeight: 400,
    },
    [theme.breakpoints.down('sm')]: {
      title: {
        fontSize: '1rem',
      },
    },
  })
);
