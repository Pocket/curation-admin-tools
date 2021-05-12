import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import ReactMarkdown from 'react-markdown';
import { CollectionModel } from '../../api';
import { useStyles } from './CollectionInfo.styles';
import { CollectionAuthor } from '../../api/generatedTypes';
import { ImageUpload } from '../ImageUpload/ImageUpload';

interface CollectionInfoProps {
  /**
   * An object with everything collection-related in it.
   */
  collection: CollectionModel;
}

export const CollectionInfo: React.FC<CollectionInfoProps> = (
  props
): JSX.Element => {
  const { collection } = props;
  const classes = useStyles();

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <ImageUpload
            entity={collection}
            placeholder="/placeholders/collection.svg"
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <Typography
            className={classes.subtitle}
            variant="subtitle2"
            color="textSecondary"
            component="span"
            align="left"
          >
            <span>{collection.status}</span> &middot;{' '}
            <span>
              {collection.authors
                .map((author: CollectionAuthor) => {
                  return author.name;
                })
                .join(', ')}
            </span>
          </Typography>
          <h3>Excerpt</h3>
          <Typography
            className={classes.excerpt}
            variant="subtitle2"
            color="textSecondary"
            component="span"
            align="left"
          >
            <ReactMarkdown>{collection.excerpt}</ReactMarkdown>
          </Typography>
          <h3>Intro</h3>
          <Typography
            variant="subtitle2"
            color="textSecondary"
            component="span"
            align="left"
          >
            <ReactMarkdown>{collection.intro}</ReactMarkdown>
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};
