import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

/**
 * Styles for the LabelListCard component.
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
    title: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    [theme.breakpoints.down('sm')]: {
      title: {
        fontSize: '1rem',
      },
    },
  })
);
