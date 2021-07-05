import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

/**
 * Styles for the StoryListCard component.
 */
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: 'auto',
      padding: '0.5rem 0.25rem',
      border: 0,
      borderBottom: `1px solid ${theme.palette.grey[300]}`,
    },
    image: {
      borderRadius: 4,
    },
    link: {
      textDecoration: 'none',
      padding: '1.25 rem 0',
    },
  })
);
