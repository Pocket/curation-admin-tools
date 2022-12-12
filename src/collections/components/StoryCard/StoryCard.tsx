import React from 'react';
import { Grid, Hidden, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ReactMarkdown from 'react-markdown';
import { CollectionStory } from '../../../api/generatedTypes';
import { flattenAuthors } from '../../../_shared/utils/flattenAuthors';

interface StoryCardProps {
  /**
   * A story that belongs to one or more collections
   */
  story: CollectionStory;
}

/**
 * A layout only component that displays Collection Story information such as title, authors, excerpt
 */
export const StoryCard: React.FC<StoryCardProps> = (props): JSX.Element => {
  const { story } = props;

  // Work out a comma-separated list of authors if there are any for this story
  const displayAuthors = flattenAuthors(story.authors);

  // The &middot; character is only needed if the story has authors as it separates
  // the list of authors and the name of the publisher.
  // There appears to be no way to display an HTML special character conditionally
  // (well, except for setting innerHTML directly) other than assigning it to a variable
  const middot = '\u00b7';

  return (
    <>
      <Typography
        variant="h5"
        align="left"
        gutterBottom
        sx={{
          fontSize: '1.125rem',
          fontWeight: 500,
          '& a': {
            textDecoration: 'none',
            color: '#222222',
          },
        }}
      >
        <a href={story.url} target="_blank" rel="noreferrer">
          {story.title}
        </a>
      </Typography>

      <Typography
        variant="subtitle2"
        color="textSecondary"
        component="span"
        align="left"
        sx={{ fontWeight: 400 }}
      >
        <span>{displayAuthors}</span>
        {displayAuthors.length > 0 && ` ${middot} `}
        <span>{story.publisher}</span>
      </Typography>
      {story.fromPartner && (
        <Grid container alignItems="center">
          <Grid item>
            <CheckIcon color="primary" />
          </Grid>
          <Grid item>
            <Typography
              color="primary"
              variant="subtitle2"
              sx={{ fontWeight: 400 }}
            >
              From partner/sponsor
            </Typography>
          </Grid>
        </Grid>
      )}
      <Hidden smDown implementation="css">
        <Typography component="div">
          <ReactMarkdown className="compact-markdown">
            {story.excerpt ? story.excerpt : ''}
          </ReactMarkdown>
        </Typography>
      </Hidden>
    </>
  );
};
