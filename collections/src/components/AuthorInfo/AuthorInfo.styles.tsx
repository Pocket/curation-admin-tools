import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

/**
 * Styles for the AuthorInfo component.
 */
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    image: {
      borderRadius: 4,
    },
    subtitle: {
      fontWeight: 400,
    },
  })
);
