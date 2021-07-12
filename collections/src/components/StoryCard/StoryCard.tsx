import React from 'react';
import { Hidden, Typography } from '@material-ui/core';
import ReactMarkdown from 'react-markdown';
import { useStyles } from './StoryCard.styles';
import { CollectionStory } from '../../api/collection-api/generatedTypes';
import { flattenAuthors } from '../../utils/flattenAuthors';

interface StoryCardProps {
  /**
   * A story that belongs to one or more collections
   */
  story: CollectionStory;
}

/**
 * A purely layout component that displays Collection Story information such as title, authors, excerpt
 */
export const StoryCard: React.FC<StoryCardProps> = (props): JSX.Element => {
  const { story } = props;
  const classes = useStyles();

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
        className={classes.title}
        variant="h3"
        align="left"
        gutterBottom
      >
        <a href={story.url}>{story.title}</a>
      </Typography>
      <Typography
        className={classes.subtitle}
        variant="subtitle2"
        color="textSecondary"
        component="span"
        align="left"
      >
        <span>{displayAuthors}</span>
        {displayAuthors.length > 0 && ` ${middot} `}
        <span>{story.publisher}</span>
      </Typography>
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
