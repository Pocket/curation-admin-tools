import React from 'react';
import { AuthorModel } from '../../api';
import { CardMedia, Grid, Typography } from '@material-ui/core';

import { useStyles } from './AuthorInfo.styles';
interface AuthorInfoProps {
  /**
   * An object with everything author-related in it.
   */
  author: AuthorModel;
}

export const AuthorInfo: React.FC<AuthorInfoProps> = (props): JSX.Element => {
  const { author } = props;
  const classes = useStyles();

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <CardMedia
            component="img"
            src={author.imageUrl}
            alt={author.name}
            className={classes.image}
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <Typography
            className={classes.subtitle}
            variant="subtitle2"
            color="textSecondary"
            component="span"
            align="left"
          >
            <span>
              {author.Collections && author.Collections.length > 0
                ? `${author.Collections.length.toString()} collections`
                : 'No collections yet'}
            </span>{' '}
            &middot; <span>{author.active ? 'Active' : 'Inactive'}</span>
          </Typography>
          <Typography>{author.bio}</Typography>
        </Grid>
      </Grid>
    </>
  );
};
