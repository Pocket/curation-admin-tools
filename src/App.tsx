import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';
import theme from './theme';

import { LandingPage } from './_shared/pages';
import { CollectionsLandingPage } from './collections/pages';
import { CuratedCorpusLandingPage } from './curated-corpus/pages';
import { useAuth } from './_shared/hooks';

function App(): JSX.Element {
  const { canAccessCuration, canAccessCollections } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
        <BrowserRouter>
          <>
            <Switch>
              <Route exact path="/">
                <LandingPage />
              </Route>
              {canAccessCollections && (
                <Route path="/collections">
                  <CollectionsLandingPage />
                </Route>
              )}
              {canAccessCuration && (
                <Route path="/curated-corpus">
                  <CuratedCorpusLandingPage />
                </Route>
              )}
            </Switch>
          </>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
