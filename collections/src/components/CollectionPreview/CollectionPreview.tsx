import React from 'react';
import { Card, Grid, Typography } from '@material-ui/core';
import ReactMarkdown from 'react-markdown';
import { useStyles } from './CollectionPreview.styles';
import {
  Collection,
  CollectionPartnershipType,
  CollectionStory,
} from '../../api/collection-api/generatedTypes';
import { flattenAuthors } from '../../utils/flattenAuthors';
import { StoryCard } from '../';

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

  /**
   * Collection-partner association, if present
   */
  association?: any;
}

export const CollectionPreview: React.FC<CollectionPreviewProps> = (
  props
): JSX.Element => {
  const { collection, stories } = props;
  const classes = useStyles();

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
            {flattenAuthors(collection.authors)}
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

        {collection.partnership && (
          <Grid item xs={12}>
            {collection.partnership.type === CollectionPartnershipType.Partnered
              ? 'In partnership with '
              : 'Brought to you by '}
            <a href={collection.partnership.url}>
              {collection.partnership.name}
            </a>
          </Grid>
        )}

        {stories &&
          stories.map((story: CollectionStory) => {
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
                    <StoryCard story={story} />
                  </Grid>
                </Grid>
              </Card>
            );
          })}
      </Grid>
    </>
  );
};
