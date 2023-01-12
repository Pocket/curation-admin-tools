import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Link as RouterLink } from 'react-router-dom';
import { CardMedia, Grid, Typography } from '@mui/material';
import { CollectionPartner } from '../../../api/generatedTypes';
import { StyledCardLink, StyledListCard } from '../../../_shared/styled';

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
  const { partner } = props;

  // We pass the partner object along with the link so that when the user clicks
  // on the card to go to an individual partner's page, the page is loaded instantly.
  return (
    <StyledCardLink
      component={RouterLink}
      to={{
        pathname: `/collections/partners/${partner.externalId}/`,
        state: { partner },
      }}
    >
      <StyledListCard square>
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
              sx={{
                borderRadius: 1,
              }}
            />
          </Grid>
          <Grid item xs={8} sm={10}>
            <Typography variant="h5" align="left" gutterBottom>
              {partner.name}
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
              <span>{partner.url}</span>
            </Typography>
            <Typography noWrap component="div">
              <ReactMarkdown>
                {partner.blurb ? partner.blurb.substring(0, 100) : ''}
              </ReactMarkdown>
            </Typography>
          </Grid>
        </Grid>
      </StyledListCard>
    </StyledCardLink>
  );
};
