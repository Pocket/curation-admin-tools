import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Box, Chip, Typography } from '@mui/material';
import AdUnitsIcon from '@mui/icons-material/AdUnits';
import CategoryIcon from '@mui/icons-material/Category';
import LanguageIcon from '@mui/icons-material/Language';

import { Collection, CollectionStatus } from '../../../api/generatedTypes';
import { ChipLabelsList } from '../';
import { flattenAuthors } from '../../../_shared/utils/flattenAuthors';

interface CollectionInfoProps {
  /**
   * An object with everything collection-related in it.
   * Except for stories. We load them separately.
   */
  collection: Omit<Collection, 'stories'>;
}

export const CollectionInfo: React.FC<CollectionInfoProps> = (
  props,
): JSX.Element => {
  const { collection } = props;

  const baseURL = 'https://getpocket.com/collections/';

  // Link to a published collection or one under review on production.
  const linkIsClickable = [
    CollectionStatus.Review,
    CollectionStatus.Published,
  ].includes(collection.status);

  return (
    <>
      <Typography
        variant="subtitle2"
        color="textSecondary"
        component="span"
        align="left"
        sx={{ fontWeight: 400 }}
      >
        <span>{collection.status}</span> &middot;{' '}
        <span>{flattenAuthors(collection.authors)}</span>
      </Typography>
      <Box py={1}>
        <Chip
          variant="outlined"
          color="primary"
          label={collection.language.toUpperCase()}
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
          <ChipLabelsList collection={collection} enableOnClick={false} />
        )}
      </Box>

      <h3>Slug</h3>
      <Typography
        variant="subtitle2"
        color="textSecondary"
        component="span"
        align="left"
      >
        {linkIsClickable && (
          <a
            href={`${baseURL}${collection.slug}`}
            target="_blank"
            rel="noreferrer"
          >
            {`${baseURL}${collection.slug}`}
          </a>
        )}
        {!linkIsClickable && (
          <>
            {baseURL}
            <Typography component="span">
              <strong>{collection.slug}</strong>
            </Typography>
          </>
        )}
      </Typography>
      <h3>Excerpt</h3>
      <Typography
        variant="subtitle2"
        color="textSecondary"
        component="span"
        align="left"
        sx={{ fontWeight: 400 }}
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
    </>
  );
};
