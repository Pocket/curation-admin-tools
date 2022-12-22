import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import { HeaderConnector } from '../../components';
import { StyledContainer, StyledRouterLink } from '../../styled';
import { useMozillaAuth } from '../../hooks';

export const LandingPage = (): JSX.Element => {
  const { canAccessCuration, canAccessCollections } = useMozillaAuth();

  return (
    <>
      <HeaderConnector
        productName="Curation Tools"
        productLink=""
        menuLinks={[]}
      />
      <StyledContainer>
        <Grid
          container
          spacing={2}
          sx={{
            flexGrow: 1,
          }}
        >
          {canAccessCollections && (
            <Grid item xs={12} sm={6}>
              <Paper>
                <StyledRouterLink to="/collections">
                  <Typography variant="h3" component="div">
                    <CollectionsBookmarkIcon fontSize="inherit" />
                  </Typography>
                  <h2>Collections</h2>
                </StyledRouterLink>
              </Paper>
            </Grid>
          )}

          {canAccessCuration && (
            <Grid item xs={12} sm={6}>
              <Paper>
                <StyledRouterLink to="/curated-corpus">
                  <Typography variant="h3" component="div">
                    <LibraryAddCheckIcon fontSize="inherit" />
                  </Typography>
                  <h2>Curated Corpus</h2>
                </StyledRouterLink>
              </Paper>
            </Grid>
          )}
        </Grid>
      </StyledContainer>
    </>
  );
};
