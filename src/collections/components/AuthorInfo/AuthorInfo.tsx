import React from 'react';
import { Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import { CollectionAuthor } from '../../../api/generatedTypes';

interface AuthorInfoProps {
  /**
   * An object with everything author-related in it.
   */
  author: CollectionAuthor;
}

/**
 * A simple component that shows author information. The name of the author
 * and their photo are rendered by other components.
 *
 * @param props
 * @constructor
 */
export const AuthorInfo: React.FC<AuthorInfoProps> = (props): JSX.Element => {
  const { author } = props;

  return (
    <>
      <Typography
        variant="subtitle2"
        color="textSecondary"
        component="span"
        align="left"
        sx={{
          fontWeight: 400,
        }}
      >
        <span>{author.active ? 'Active' : 'Inactive'}</span>
      </Typography>
      <ReactMarkdown>{author.bio}</ReactMarkdown>
    </>
  );
};
