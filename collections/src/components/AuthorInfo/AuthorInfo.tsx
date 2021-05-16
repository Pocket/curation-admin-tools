import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import ReactMarkdown from 'react-markdown';
import { AuthorModel } from '../../api';
import { useStyles } from './AuthorInfo.styles';
import { ImageUpload } from '../ImageUpload/ImageUpload';

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
          <ImageUpload entity={author} placeholder="/placeholders/author.svg" />
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
