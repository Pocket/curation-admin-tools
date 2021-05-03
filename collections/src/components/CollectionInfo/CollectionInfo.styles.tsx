import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

/**
 * Styles for the CollectionInfo component.
 */
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    image: {
      borderRadius: '0.25rem',
    },
    excerpt: {
      fontWeight: 400,
    },
    subtitle: {
      fontWeight: 400,
      textTransform: 'capitalize',
    },
  })
);
