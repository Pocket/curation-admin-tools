import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

/**
 * Styles for the AuthorInfo component.
 */
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    image: {
      borderRadius: '0.25rem',
      cursor: 'pointer',
    },
    subtitle: {
      fontWeight: 400,
    },
  })
);
