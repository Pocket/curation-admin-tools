import React from 'react';
import { Link } from 'react-router-dom';
import {
  Avatar,
  Box,
  Card,
  CardMedia,
  Chip,
  Grid,
  Typography,
} from '@material-ui/core';
import ReactMarkdown from 'react-markdown';
import { useStyles } from './CollectionListCard.styles';
import { Collection, Image } from '../../../api/generatedTypes';
import LabelOutlinedIcon from '@material-ui/icons/LabelOutlined';
import { flattenAuthors } from '../../../_shared/utils/flattenAuthors';
import LanguageIcon from '@material-ui/icons/Language';

interface CollectionListCardProps {
  /**
   * An object with everything collection-related in it.
   * Except for stories. We don't need them in the card.
   */
  collection: Omit<Collection, 'stories' | 'image' | 'partnership'> & {
    image?: Omit<Image, 'src'> | null;
  };
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
        pathname: `/collections/collections/${collection.externalId}/`,
        state: { collection },
      }}
      className={classes.link}
    >
      <Card variant="outlined" square className={classes.root}>
        <Grid container spacing={2}>
          <Grid item xs={4} sm={2}>
            <CardMedia
              component="img"
              src={collection.image?.url ?? '/placeholders/collectionSmall.svg'}
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
              <span>{collection.status}</span> &middot;{' '}
              <span>{flattenAuthors(collection.authors)}</span>
            </Typography>{' '}
            <Box py={1}>
              <Chip
                variant="outlined"
                color="primary"
                label={collection.language}
                icon={<LanguageIcon />}
              />{' '}
              {collection.curationCategory && (
                <Chip
                  variant="outlined"
                  color="primary"
                  label={collection.curationCategory.name}
                  icon={<LabelOutlinedIcon />}
                />
              )}{' '}
              {collection.IABParentCategory && collection.IABChildCategory && (
                <Chip
                  variant="outlined"
                  color="primary"
                  label={`${collection.IABParentCategory.name} → ${collection.IABChildCategory.name}`}
                  icon={<Avatar className={classes.iabAvatar}>IAB</Avatar>}
                />
              )}
            </Box>
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
