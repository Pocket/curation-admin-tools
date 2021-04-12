import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardMedia, Grid, Typography } from '@material-ui/core';

import { AuthorModel } from '../../api';
import { useStyles } from './AuthorListCard.styles';

export interface AuthorCardProps {
  author: AuthorModel;
}

/**
 * A compact card that displays author information and links to the author page.
 *
 * @param props
 */
export const AuthorListCard: React.FC<AuthorCardProps> = (props) => {
  const classes = useStyles();
  const { author } = props;

  return (
    <Link to={`/authors/${author.slug}/`} className={classes.link}>
      <Card variant="outlined" square className={classes.root}>
        <Grid container spacing={2}>
          <Grid item xs={4} sm={2}>
            <CardMedia
              component="img"
              src={author.imageUrl}
              alt={author.name}
              className={classes.image}
            />
          </Grid>
          <Grid item xs={8} sm={10}>
            <Typography
              className={classes.title}
              variant="h3"
              align="left"
              gutterBottom
            >
              {author.name}
            </Typography>
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
            <Typography noWrap>{author.bio}</Typography>
          </Grid>
        </Grid>
      </Card>
    </Link>
  );
};
