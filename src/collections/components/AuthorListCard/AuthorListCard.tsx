import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { CardMedia, Grid, Typography } from '@mui/material';
import { CollectionAuthor } from '../../../api/generatedTypes';
import { StyledCardLink, StyledListCard } from '../../../_shared/styled';

interface AuthorListCardProps {
  /**
   * An object with everything author-related in it.
   */
  author: CollectionAuthor;
}

/**
 * A compact card that displays author information and links to the author page.
 *
 * @param props
 */
export const AuthorListCard: React.FC<AuthorListCardProps> = (props) => {
  const { author } = props;

  // We pass the author object along with the link so that when the user clicks
  // on the card to go to an individual author's page, the page is loaded instantly.
  return (
    <StyledCardLink
      component={RouterLink}
      to={{
        pathname: `/collections/authors/${author.externalId}/`,
        state: { author },
      }}
    >
      <StyledListCard square>
        <Grid container spacing={2}>
          <Grid item xs={4} sm={2}>
            <CardMedia
              component="img"
              src={
                author.imageUrl && author.imageUrl.length > 0
                  ? author.imageUrl
                  : '/placeholders/authorSmall.svg'
              }
              alt={author.name}
              sx={{
                borderRadius: 1,
              }}
            />
          </Grid>
          <Grid item xs={8} sm={10}>
            <Typography variant="h5" align="left" gutterBottom>
              {author.name}
            </Typography>
            <Typography
              sx={{
                fontWeight: 400,
              }}
              variant="subtitle2"
              color="textSecondary"
              component="span"
              align="left"
            >
              <span>{author.active ? 'Active' : 'Inactive'}</span>
            </Typography>
            <Typography noWrap component="div">
              <ReactMarkdown>
                {author.bio ? author.bio.substring(0, 100) : ''}
              </ReactMarkdown>
            </Typography>
          </Grid>
        </Grid>
      </StyledListCard>
    </StyledCardLink>
  );
};
