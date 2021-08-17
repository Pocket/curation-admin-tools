import React from 'react';
import {
  Box,
  Button as MuiButton,
  Card,
  Grid,
  Typography,
} from '@material-ui/core';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import ReactMarkdown from 'react-markdown';
import { useStyles } from './CollectionPreview.styles';
import {
  Collection,
  CollectionPartnerAssociation,
  CollectionPartnershipType,
  CollectionStory,
} from '../../api/collection-api/generatedTypes';
import { flattenAuthors } from '../../utils/flattenAuthors';
import { Button, StoryCard } from '../';

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
  association: CollectionPartnerAssociation | undefined | null;
}

export const CollectionPreview: React.FC<CollectionPreviewProps> = (
  props
): JSX.Element => {
  const { collection, stories, association } = props;
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
          <b>Pocket Collections</b> |{' '}
          <span>{flattenAuthors(collection.authors)}</span>
        </Grid>
        <Grid item xs={12}>
          <Box display="inline" marginRight={2}>
            <Button color="primary" className={classes.button}>
              <FavoriteBorderIcon fontSize="small" />
              &nbsp;Save
            </Button>
          </Box>
          <span className={classes.excerpt}>
            How was it? Save stories you love and never lose them.
          </span>
        </Grid>
        <Grid item xs={12}>
          <img width="100%" src={collection.imageUrl} alt={collection.title} />
        </Grid>
        <Grid item xs={12}>
          <ReactMarkdown className={classes.intro}>
            {collection.intro}
          </ReactMarkdown>
        </Grid>

        {association && (
          <Grid item xs={12}>
            <Grid container alignItems="center" direction="row">
              <Grid item xs={6}>
                <p className="partnerTypeCopy">
                  {association.type === CollectionPartnershipType.Partnered
                    ? 'In partnership with: '
                    : 'Brought to you by: '}
                </p>
              </Grid>
              <Grid item xs={6}>
                {/* The data needs to be queried from the association object
                rather than collection.partnership since the latter is cached
                and may not reflect the most recent updates to the collection */}
                <img
                  src={
                    association.imageUrl
                      ? association.imageUrl
                      : association.partner.imageUrl
                  }
                  className={classes.partnerImage}
                  alt={
                    association.name
                      ? association.name
                      : association.partner.name
                  }
                />
              </Grid>
            </Grid>
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
                  <Grid item xs={3}></Grid>
                  <Grid item xs={9}>
                    <MuiButton className={classes.greyButton}>
                      <FavoriteBorderIcon fontSize="small" />
                      &nbsp;Save
                    </MuiButton>
                  </Grid>
                </Grid>
              </Card>
            );
          })}
      </Grid>
    </>
  );
};
