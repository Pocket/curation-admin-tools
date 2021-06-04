import React from 'react';
import { Typography } from '@material-ui/core';
import ReactMarkdown from 'react-markdown';
import { AuthorModel } from '../../api/collection-api';
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
    </>
  );
};
