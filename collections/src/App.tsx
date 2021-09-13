import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';
import theme from './theme';

import { LandingPage } from './_shared/pages';
import { CollectionsLandingPage } from './collections/pages';
import { ProspectsLandingPage } from './prospects/pages';

function App(): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
        <BrowserRouter>
          <>
            <Switch>
              <Route exact path="/">
                <LandingPage />
              </Route>
              <Route path="/collections">
                <CollectionsLandingPage />
              </Route>
              <Route path="/prospects">
                <ProspectsLandingPage />
              </Route>
            </Switch>
          </>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
