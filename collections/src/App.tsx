import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from '@material-ui/core/styles';

import { client } from './api';
import theme from './theme';
import { HomePage, AuthorsPage } from './pages';
import { Header, MainContentWrapper } from './components';

function App(): JSX.Element {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <>
            <Header />
            <MainContentWrapper>
              <Switch>
                <Route exact path="/">
                  <HomePage />
                </Route>
                <Route exact path="/authors/">
                  <AuthorsPage />
                </Route>
              </Switch>
            </MainContentWrapper>
          </>
        </BrowserRouter>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
