import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

/**
 * Styles for the CollectionInfo component.
 */
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    excerpt: {
      fontWeight: 400,
    },
    subtitle: {
      fontWeight: 400,
      textTransform: 'capitalize',
    },
    iabAvatar: {
      height: theme.spacing(3),
      width: theme.spacing(3),
      fontSize: '0.875rem',
      backgroundColor: '#ffffff',
      border: `1px solid ${theme.palette.primary.light}`,
    },
  })
);
