import React from 'react';
import { Header, MainContentWrapper } from '../../components';
import { Grid, Paper, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useStyles } from './LandingPage.styles';
import CollectionsBookmarkIcon from '@material-ui/icons/CollectionsBookmark';
import LibraryAddCheckIcon from '@material-ui/icons/LibraryAddCheck';
import { useAuth } from '../../hooks';

export const LandingPage = (): JSX.Element => {
  const classes = useStyles();
  const { canAccessCuration, canAccessCollections } = useAuth();

  return (
    <>
      <Header productName="Curation Tools" menuLinks={[]} />
      <MainContentWrapper>
        <Grid container spacing={2} className={classes.root}>
          {canAccessCollections && (
            <Grid item xs={12} sm={6}>
              <Paper className={classes.paper}>
                <Link to="/collections" className={classes.link}>
                  <Typography variant="h3" component="div">
                    <CollectionsBookmarkIcon fontSize="inherit" />
                  </Typography>
                  <h2>Collections</h2>
                </Link>
              </Paper>
            </Grid>
          )}

          {canAccessCuration && (
            <Grid item xs={12} sm={6}>
              <Paper className={classes.paper}>
                <Link to="/curated-corpus" className={classes.link}>
                  <Typography variant="h3" component="div">
                    <LibraryAddCheckIcon fontSize="inherit" />
                  </Typography>
                  <h2>Curated Corpus</h2>
                </Link>
              </Paper>
            </Grid>
          )}
        </Grid>
      </MainContentWrapper>
    </>
  );
};
