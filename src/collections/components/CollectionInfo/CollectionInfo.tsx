import React from 'react';
import { Avatar, Box, Chip, Typography } from '@material-ui/core';
import LabelOutlinedIcon from '@material-ui/icons/LabelOutlined';
import LanguageIcon from '@material-ui/icons/Language';
import ReactMarkdown from 'react-markdown';
import { useStyles } from './CollectionInfo.styles';
import { Collection, CollectionStatus } from '../../../api/generatedTypes';
import { flattenAuthors } from '../../../_shared/utils/flattenAuthors';
import CategoryIcon from '@material-ui/icons/Category';

interface CollectionInfoProps {
  /**
   * An object with everything collection-related in it.
   * Except for stories. We load them separately.
   */
  collection: Omit<Collection, 'stories'>;
}

export const CollectionInfo: React.FC<CollectionInfoProps> = (
  props
): JSX.Element => {
  const { collection } = props;
  const classes = useStyles();

  const baseURL = 'https://getpocket.com/collections/';

  // Link to a published collection or one under review on production.
  const linkIsClickable = [
    CollectionStatus.Review,
    CollectionStatus.Published,
  ].includes(collection.status);

  return (
    <>
      <Typography
        className={classes.subtitle}
        variant="subtitle2"
        color="textSecondary"
        component="span"
        align="left"
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
            icon={<Avatar className={classes.iabAvatar}>IAB</Avatar>}
          />
        )}{' '}
        {collection.labels &&
          collection.labels.length > 0 &&
          collection.labels.map((data, index) => {
            return (
              <Chip
                key={data?.externalId}
                variant="outlined"
                color="primary"
                label={data?.name}
                icon={<LabelOutlinedIcon />}
              />
            );
          })}
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
    </>
  );
};
