import React from 'react';
import { Card, CardMedia, Grid, Typography } from '@material-ui/core';
import { useStyles } from './AuthorCard.styles';
import { AuthorModel } from '../../api';
import { Button } from '../';

export interface AuthorCardProps {
  author: AuthorModel;
}
export const AuthorCard: React.FC<AuthorCardProps> = (props) => {
  const classes = useStyles();
  const { author } = props;

  return (
    <Card variant="outlined" square className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          <CardMedia
            component="img"
            src={author?.imageUrl}
            alt={author?.name}
            className={classes.image}
          />
        </Grid>
        <Grid item xs={12} sm={9}>
          {/*<CardText*/}
          {/*  author={author.author ?? ''}*/}
          {/*  excerpt={author.excerpt ?? ''}*/}
          {/*  publisher={author.publisher ?? ''}*/}
          {/*  title={author.title}*/}
          {/*  url={author.url}*/}
          {/*  label={label}*/}
          {/*  labelColor={labelColor}*/}
          {/*/>*/}
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            variant="caption"
            color="textSecondary"
            component="span"
            align="left"
          >
            {/*{author.source} &middot; {author.topic || 'Uncategorized'}*/}
          </Typography>
        </Grid>
        <Grid item className={classes.bottomRightCell} xs={12} sm={6}>
          <Button buttonType="positive">Edit</Button>
          <Button buttonType="positive">View Collections</Button>
        </Grid>
      </Grid>
    </Card>
  );
};
