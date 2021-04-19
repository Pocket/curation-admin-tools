import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from '@material-ui/core/styles';

import { client } from './api';
import theme from './theme';
import {
  HomePage,
  AuthorListPage,
  AuthorPage,
  AddAuthorPage,
  CollectionListPage,
  CollectionPage,
} from './pages';
import { Header, MainContentWrapper, MenuLink } from './components';

const menuLinks: MenuLink[] = [
  {
    text: 'Collections',
    url: '/collections/',
  },
  {
    text: 'Authors',
    url: '/authors/',
  },
  {
    text: 'Search',
    url: '/search/',
  },
];

function App(): JSX.Element {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <>
            <Header productName="Collections" menuLinks={menuLinks} />
            <MainContentWrapper>
              <Switch>
                <Route exact path="/">
                  <HomePage />
                </Route>
                <Route exact path="/authors/">
                  <AuthorListPage />
                </Route>
                <Route exact path="/authors/add/">
                  <AddAuthorPage />
                </Route>
                <Route exact path="/authors/:id/">
                  <AuthorPage />
                </Route>
                <Route exact path="/collections/">
                  <CollectionListPage />
                </Route>
                <Route exact path="/collections/:id/">
                  <CollectionPage />
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
