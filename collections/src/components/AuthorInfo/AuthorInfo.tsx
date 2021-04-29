import React from 'react';
import { Box, CardMedia, Grid, Typography } from '@material-ui/core';
import ReactMarkdown from 'react-markdown';
import { Button } from '../';
import { AuthorModel } from '../../api';
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

  const hasImage = author.imageUrl && author.imageUrl.length > 0;

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <CardMedia
            component="img"
            src={hasImage ? author.imageUrl : '/placeholders/author.svg'}
            alt={author.name}
            className={classes.image}
          />
          <Box display="flex" justifyContent="center" mt={1}>
            <Button buttonType="hollow">Upload new image</Button>
          </Box>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Typography
            className={classes.subtitle}
            variant="subtitle2"
            color="textSecondary"
            component="span"
            align="left"
          >
            <span>{author.active ? 'Active' : 'Inactive'}</span>
          </Typography>
          <ReactMarkdown>{author.bio}</ReactMarkdown>
        </Grid>
      </Grid>
    </>
  );
};
