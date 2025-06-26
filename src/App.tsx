import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { ApolloProvider } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { SnackbarProvider } from 'notistack';
import theme from './theme';

import { LandingPage } from './_shared/pages';
import { PageNotFound } from './_shared/components/';
import { CollectionsLandingPage } from './collections/pages';
import { CuratedCorpusLandingPage } from './curated-corpus/pages';
import { ModerationLandingPage } from './moderation/pages';
import { useMozillaAuth } from './_shared/hooks';
import { client } from './api/client';
//test
function App(): JSX.Element {
  const {
    canAccessCollections,
    canAccessCuration,
    canAccessModeration,
    jwtIdToken,
  } = useMozillaAuth();

  // create an ApolloLink that adds the authorization header
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: jwtIdToken ? `Bearer ${jwtIdToken}` : '',
      },
    };
  });

  // concat the existing client link with our new authorization header link
  // this will attach the auth header to all the requests that will be made
  // that are wrapped by the ApolloProvider
  client.setLink(authLink.concat(client.link));

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={3}>
          <BrowserRouter>
            <>
              <Switch>
                <Route exact path="/">
                  <LandingPage />
                </Route>
                <Route exact path="/oauth/callback">
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
                {canAccessModeration && (
                  <Route path="/moderation">
                    <ModerationLandingPage />
                  </Route>
                )}
                <Route component={PageNotFound} />
              </Switch>
            </>
          </BrowserRouter>
        </SnackbarProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
