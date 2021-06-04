import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';

import { client } from './api/collection-api';
import theme from './theme';
import {
  HomePage,
  AuthorListPage,
  AuthorPage,
  AddAuthorPage,
  CollectionListPage,
  CollectionSearchPage,
  CollectionPage,
  AddCollectionPage,
} from './pages';
import { Header, MainContentWrapper, MenuLink } from './components';

const menuLinks: MenuLink[] = [
  {
    text: 'Collections',
    url: '/collections/drafts/',
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
        <SnackbarProvider maxSnack={3}>
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
                  <Route exact path="/collections/add/">
                    <AddCollectionPage />
                  </Route>
                  <Route path="/collections/:status(drafts|published|archived)/">
                    <CollectionListPage />
                  </Route>
                  <Route exact path="/collections/:id/">
                    <CollectionPage />
                  </Route>
                  <Route exact path="/search/">
                    <CollectionSearchPage />
                  </Route>
                </Switch>
              </MainContentWrapper>
            </>
          </BrowserRouter>
        </SnackbarProvider>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
