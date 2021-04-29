import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardMedia, Grid, Typography } from '@material-ui/core';
import ReactMarkdown from 'react-markdown';
import { CollectionModel } from '../../api';
import { useStyles } from './CollectionListCard.styles';

interface CollectionListCardProps {
  collection: CollectionModel;
}

/**
 * A compact card that displays collection information and links to the collection page.
 *
 * @param props
 */
export const CollectionListCard: React.FC<CollectionListCardProps> = (
  props
) => {
  const classes = useStyles();
  const { collection } = props;

  return (
    <Link
      to={{
        pathname: `/collections/${collection.externalId}/`,
        state: { collection },
      }}
      className={classes.link}
    >
      <Card variant="outlined" square className={classes.root}>
        <Grid container spacing={2}>
          <Grid item xs={4} sm={2}>
            <CardMedia
              component="img"
              src={
                collection.imageUrl && collection.imageUrl.length > 0
                  ? collection.imageUrl
                  : '/placeholders/collectionSmall.svg'
              }
              alt={collection.title}
              className={classes.image}
            />
          </Grid>
          <Grid item xs={8} sm={10}>
            <Typography
              className={classes.title}
              variant="h3"
              align="left"
              gutterBottom
            >
              {collection.title}
            </Typography>
            <Typography
              className={classes.subtitle}
              variant="subtitle2"
              color="textSecondary"
              component="span"
              align="left"
            >
              <span>{collection.status}</span>
              {/*{' '}*/}
              {/*&middot; <span>TODO: collection.authors</span>*/}
            </Typography>
            <Typography noWrap component="div">
              <ReactMarkdown>
                {collection.excerpt ? collection.excerpt.substring(0, 100) : ''}
              </ReactMarkdown>
            </Typography>
          </Grid>
        </Grid>
      </Card>
    </Link>
  );
};
