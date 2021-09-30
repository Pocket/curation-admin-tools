import React from 'react';
import { useStyles } from './CuratedItemListCard.styles';
import { Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardMedia,
  Chip,
  Grid,
  Typography,
} from '@material-ui/core';
import LanguageIcon from '@material-ui/icons/Language';
import ReactMarkdown from 'react-markdown';
import { CuratedItem } from '../../api/curated-corpus-api/generatedTypes';

interface CuratedItemListCardProps {
  /**
   * An object with everything curated item-related in it.
   */
  item: CuratedItem;
}

export const CuratedItemListCard: React.FC<CuratedItemListCardProps> = (
  props
): JSX.Element => {
  const classes = useStyles();
  const { item } = props;

  return (
    <Link
      to={{
        pathname: `/prospects/corpus/${item.externalId}/`,
        state: { item },
      }}
      className={classes.link}
    >
      <Card variant="outlined" square className={classes.root}>
        <Grid container spacing={2}>
          <Grid item xs={4} sm={2}>
            <CardMedia
              component="img"
              src={
                item.imageUrl && item.imageUrl.length > 0
                  ? item.imageUrl
                  : '/placeholders/collectionSmall.svg'
              }
              alt={item.title}
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
              {item.title}
            </Typography>
            <Typography
              className={classes.subtitle}
              variant="subtitle2"
              color="textSecondary"
              component="span"
              align="left"
            >
              <span>{item.status}</span>
            </Typography>{' '}
            <Box py={1}>
              <Chip
                variant="outlined"
                color="primary"
                label={item.language.toUpperCase()}
                icon={<LanguageIcon />}
              />
            </Box>
            <Typography noWrap component="div">
              <ReactMarkdown>
                {item.excerpt ? item.excerpt.substring(0, 100) : ''}
              </ReactMarkdown>
            </Typography>
          </Grid>
        </Grid>
      </Card>
    </Link>
  );
};
