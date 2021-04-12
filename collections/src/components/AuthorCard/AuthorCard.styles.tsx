import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

/**
 * Styles for the AuthorCard component.
 */
export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: 'auto',
      paddingBottom: '0.75rem',
      marginBottom: '2.5rem',
      paddingTop: 0,
      border: 0,
      borderBottom: `1px solid ${theme.palette.grey[400]}`,
    },
    image: {
      borderRadius: 4,
    },
    bottomRightCell: {
      display: 'flex',
    },
    [theme.breakpoints.down('sm')]: {
      bottomRightCell: {
        justifyContent: 'flex-start',
        '& > *': {
          marginRight: '0.625rem',
        },
      },
    },
    [theme.breakpoints.up('md')]: {
      bottomRightCell: {
        justifyContent: 'flex-end',
        '& > *': {
          marginLeft: '0.625rem',
        },
      },
    },
  })
);
