import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { client } from '../../../api/client';
import {
  HeaderConnector,
  MainContentWrapper,
  MenuLink,
} from '../../../_shared/components';
import { useMozillaAuth } from '../../../_shared/hooks';
import {
  AddAuthorPage,
  AddCollectionPage,
  AddPartnerPage,
  AuthorListPage,
  AuthorPage,
  CollectionListPage,
  CollectionPage,
  CollectionSearchPage,
  CollectionsHomePage,
  PartnerListPage,
  PartnerPage,
} from '../';

/**
 * Collections landing page
 */
export const CollectionsLandingPage = (): JSX.Element => {
  // Get the base path (/collections)
  const { path } = useRouteMatch();

  const menuLinks: MenuLink[] = [
    {
      text: 'Collections',
      url: `${path}/collections/drafts/`,
    },
    {
      text: 'Authors',
      url: `${path}/authors/`,
    },
    {
      text: 'Partners',
      url: `${path}/partners/`,
    },
    {
      text: 'Search',
      url: `${path}/search/`,
    },
  ];

  // we fetch the JWT hook
  const { parsedIdToken } = useMozillaAuth();

  // create an ApolloLink that adds the authorization header
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: parsedIdToken
          ? `Bearer ${JSON.stringify(parsedIdToken)}`
          : '',
      },
    };
  });

  // concat the existing client link with our new authorization header link
  // this will attach the auth header to all the requests that will be made
  // that are wrapped by the ApolloProvider
  client.setLink(authLink.concat(client.link));

  return (
    <ApolloProvider client={client}>
      <HeaderConnector
        productName="Collections"
        productLink="/collections"
        menuLinks={menuLinks}
      />
      <MainContentWrapper>
        <Switch>
          <Route exact path={path}>
            <CollectionsHomePage />
          </Route>
          <Route exact path={`${path}/authors/`}>
            <AuthorListPage />
          </Route>
          <Route exact path={`${path}/authors/add/`}>
            <AddAuthorPage />
          </Route>
          <Route exact path={`${path}/authors/:id/`}>
            <AuthorPage />
          </Route>
          <Route exact path={`${path}/collections/add/`}>
            <AddCollectionPage />
          </Route>
          <Route
            path={`${path}/collections/:status(drafts|review|published|archived)/`}
          >
            <CollectionListPage />
          </Route>
          <Route exact path={`${path}/collections/:id/`}>
            <CollectionPage />
          </Route>
          <Route exact path={`${path}/partners/`}>
            <PartnerListPage />
          </Route>
          <Route exact path={`${path}/partners/add/`}>
            <AddPartnerPage />
          </Route>
          <Route exact path={`${path}/partners/:id`}>
            <PartnerPage />
          </Route>
          <Route exact path={`${path}/search/`}>
            <CollectionSearchPage />
          </Route>
        </Switch>
      </MainContentWrapper>
    </ApolloProvider>
  );
};
