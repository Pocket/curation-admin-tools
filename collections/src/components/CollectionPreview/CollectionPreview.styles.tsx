import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

/**
 * Styles for the CollectionPreview component.
 */
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      fontFamily: '"Blanco OSF", Garamond, Times, serif',
      fontSize: '3rem',
      fontWeight: 500,
    },
    excerpt: {
      fontSize: '1.25rem',
      color: theme.palette.grey[500],
      '& p': {
        margin: 0,
      },
    },
    intro: {
      fontSize: '1.25rem',
      color: theme.palette.grey[700],
    },
    storyCard: {
      margin: 'auto',
      padding: '2rem 0.5rem',
      border: 0,
      '& h3 > a': {
        fontSize: '1.5rem',
        fontWeight: 500,
        textDecoration: 'none',
        color: '#222222',
      },
    },
    image: {
      borderRadius: 4,
    },
    partnerImage: {
      maxWidth: '120px',
    },
    partnerTypeCopy: {
      textAlign: 'right',
      marginRight: '2rem',
    },
    button: {
      fontSize: '1rem',
    },
    greyButton: {
      fontSize: '1rem',
      fontWeight: 400,
      color: theme.palette.grey[600],
    },
  })
);
