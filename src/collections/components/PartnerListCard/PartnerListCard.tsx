import React from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Card, CardMedia, Grid, Typography } from '@material-ui/core';
import { useStyles } from './PartnerListCard.styles';
import { CollectionPartner } from '../../../api/generatedTypes';

interface PartnerListCardProps {
  /**
   * An object with everything partner-related in it.
   */
  partner: CollectionPartner;
}

/**
 * A compact card that displays partner information and links to the partner page.
 *
 * @param props
 */
export const PartnerListCard: React.FC<PartnerListCardProps> = (props) => {
  const classes = useStyles();
  const { partner } = props;

  // We pass the partner object along with the link so that when the user clicks
  // on the card to go to an individual partner's page, the page is loaded instantly.
  return (
    <Link
      to={{
        pathname: `/collections/partners/${partner.externalId}/`,
        state: { partner },
      }}
      className={classes.link}
    >
      <Card variant="outlined" square className={classes.root}>
        <Grid container spacing={2}>
          <Grid item xs={4} sm={2}>
            <CardMedia
              component="img"
              src={
                partner.imageUrl && partner.imageUrl.length > 0
                  ? partner.imageUrl
                  : '/placeholders/collectionSmall.svg'
              }
              alt={partner.name}
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
              {partner.name}
            </Typography>
            <Typography
              className={classes.subtitle}
              variant="subtitle2"
              color="textSecondary"
              component="span"
              align="left"
            >
              <span>{partner.url}</span>
            </Typography>
            <Typography noWrap component="div">
              <ReactMarkdown>
                {partner.blurb ? partner.blurb.substring(0, 100) : ''}
              </ReactMarkdown>
            </Typography>
          </Grid>
        </Grid>
      </Card>
    </Link>
  );
};
