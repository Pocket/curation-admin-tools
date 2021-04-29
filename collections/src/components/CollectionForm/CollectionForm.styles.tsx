import { makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) => ({
  alignRight: {
    textAlign: 'right',
  },
  greyLink: {
    color: theme.palette.grey[600],
  },
  thumbnail: {
    maxHeight: 200,
  },
  formControl: {
    width: '100%',
  },
}));
