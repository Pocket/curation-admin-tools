import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

/**
 * Styles for the CollectionPreview component.
 */
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      fontWeight: 500,
    },
    excerpt: {
      fontSize: '1.25rem',
      color: theme.palette.grey[500],
    },
    intro: {
      fontSize: '1.25rem',
    },
    storyTitle: {
      fontSize: '1.25rem',
      fontWeight: 500,
      '& a': {
        textDecoration: 'none',
        color: '#222222',
      },
    },
    storyCard: {
      margin: 'auto',
      padding: '2rem 0.5rem',
      border: 0,
    },
    image: {
      borderRadius: 4,
    },
  })
);
