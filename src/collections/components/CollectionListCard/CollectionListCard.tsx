import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, CardMedia, Chip, Grid, Typography } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import CategoryIcon from '@mui/icons-material/Category';
import AdUnitsIcon from '@mui/icons-material/AdUnits';
import ReactMarkdown from 'react-markdown';

import { Collection } from '../../../api/generatedTypes';
import { StyledCardLink, StyledListCard } from '../../../_shared/styled';
import { ChipLabelsList } from '../';
import { flattenAuthors } from '../../../_shared/utils/flattenAuthors';

interface CollectionListCardProps {
  /**
   * An object with everything collection-related in it.
   * Except for stories. We don't need them in the card.
   */
  collection: Omit<Collection, 'stories'>;
}

/**
 * A compact card that displays collection information and links to the collection page.
 *
 * @param props
 */
export const CollectionListCard: React.FC<CollectionListCardProps> = (
  props
) => {
  const { collection } = props;
  return (
    <StyledCardLink
      component={RouterLink}
      to={{
        pathname: `/collections/collections/${collection.externalId}/`,
        state: { collection },
      }}
    >
      <StyledListCard square>
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
              sx={{
                borderRadius: 1,
              }}
            />
          </Grid>
          <Grid item xs={8} sm={10}>
            <Typography variant="h5" align="left" gutterBottom>
              {collection.title}
            </Typography>
            <Typography
              variant="subtitle2"
              color="textSecondary"
              component="span"
              align="left"
              sx={{
                fontWeight: 400,
              }}
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
                  icon={<CategoryIcon />}
                />
              )}{' '}
              {collection.IABParentCategory && collection.IABChildCategory && (
                <Chip
                  variant="outlined"
                  color="primary"
                  label={`${collection.IABParentCategory.name} → ${collection.IABChildCategory.name}`}
                  icon={<AdUnitsIcon />}
                />
              )}{' '}
              {collection && collection.labels && (
                <ChipLabelsList collection={collection} />
              )}
            </Box>
            <Typography noWrap component="div">
              <ReactMarkdown>
                {collection.excerpt ? collection.excerpt.substring(0, 100) : ''}
              </ReactMarkdown>
            </Typography>
          </Grid>
        </Grid>
      </StyledListCard>
    </StyledCardLink>
  );
};
