import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

/**
 * Styles for the StoryCard component.
 */
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      fontSize: '1.125rem',
      fontWeight: 500,
      '& a': {
        textDecoration: 'none',
        color: '#222222',
      },
    },
    subtitle: {
      fontWeight: 400,
      textTransform: 'capitalize',
    },
    [theme.breakpoints.down('sm')]: {
      title: {
        fontSize: '1rem',
      },
    },
  })
);
