import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

/**
 * Styles for the AuthorListCard component.
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
    title: {
      fontSize: '1.5rem',
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
