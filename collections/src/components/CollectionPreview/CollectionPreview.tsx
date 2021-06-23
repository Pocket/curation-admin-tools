import React from 'react';
import { Card, Grid, Hidden, Typography } from '@material-ui/core';
import ReactMarkdown from 'react-markdown';
import { useStyles } from './CollectionPreview.styles';
import {
  Collection,
  CollectionAuthor,
  CollectionStory,
  CollectionStoryAuthor,
} from '../../api/collection-api/generatedTypes';

interface CollectionPreviewProps {
  /**
   * An object with everything collection-related in it bar stories - we load them
   * separately.
   */
  collection: Omit<Collection, 'stories'>;

  /**
   * Collection stories, separately
   */
  stories: CollectionStory[] | undefined;
}

export const CollectionPreview: React.FC<CollectionPreviewProps> = (
  props
): JSX.Element => {
  const { collection, stories } = props;
  const classes = useStyles();

  // The &middot; character is only needed if the story has authors as it separates
  // the list of authors and the name of the publisher.
  // There appears to be no way to display an HTML special character conditionally
  // (well, except for setting innerHTML directly) other than assigning it to a variable
  const middot = '\u00b7';

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4" color="primary">
            Collection Preview
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" className={classes.title}>
            {collection.title}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <ReactMarkdown className={classes.excerpt}>
            {collection.excerpt}
          </ReactMarkdown>
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            color="textSecondary"
            component="span"
            align="left"
          >
            {collection.authors
              .map((author: CollectionAuthor) => {
                return author.name;
              })
              .join(', ')}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <img width="100%" src={collection.imageUrl} alt={collection.title} />
        </Grid>
        <Grid item xs={12}>
          <ReactMarkdown className={classes.intro}>
            {collection.intro}
          </ReactMarkdown>
        </Grid>
        {stories &&
          stories.map((story: CollectionStory) => {
            // TODO: decouple StoryListCard from the form so that
            // it can be used here, too

            // Work out a comma-separated list of authors if there are any for this story
            const displayAuthors = story.authors
              ?.map((author: CollectionStoryAuthor) => {
                return author.name;
              })
              .join(', ');

            return (
              <Card
                variant="outlined"
                square
                className={classes.storyCard}
                key={story.externalId}
              >
                <Grid container spacing={2}>
                  <Grid item xs={3}>
                    <img
                      src={story.imageUrl}
                      width="100%"
                      alt={story.title}
                      className={classes.image}
                    />
                  </Grid>
                  <Grid item xs={7} sm={8}>
                    <Typography
                      variant="h3"
                      align="left"
                      className={classes.storyTitle}
                      gutterBottom
                    >
                      <a href={story.url}>{story.title}</a>
                    </Typography>
                    <Typography
                      variant="subtitle1"
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
                  </Grid>
                </Grid>
              </Card>
            );
          })}
      </Grid>
    </>
  );
};
