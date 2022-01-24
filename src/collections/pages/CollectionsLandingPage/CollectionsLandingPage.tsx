import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { client } from '../../api/collection-api/client';
import {
  Header,
  MainContentWrapper,
  MenuLink,
} from '../../../_shared/components';
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
  const { pathname } = useLocation();

  const menuLinks: MenuLink[] = [
    {
      text: 'Collections',
      url: `${pathname}/collections/drafts/`,
    },
    {
      text: 'Authors',
      url: `${pathname}/authors/`,
    },
    {
      text: 'Partners',
      url: `${pathname}/partners/`,
    },
    {
      text: 'Search',
      url: `${pathname}/search/`,
    },
  ];

  return (
    <ApolloProvider client={client}>
      <Header
        productName="Collections"
        productLink="/collections"
        menuLinks={menuLinks}
      />
      <MainContentWrapper>
        <Routes>
          <Route path={pathname}>
            <CollectionsHomePage />
          </Route>
          <Route path={`${pathname}/authors/`}>
            <AuthorListPage />
          </Route>
          <Route path={`${pathname}/authors/add/`}>
            <AddAuthorPage />
          </Route>
          <Route path={`${pathname}/authors/:id/`}>
            <AuthorPage />
          </Route>
          <Route path={`${pathname}/collections/add/`}>
            <AddCollectionPage />
          </Route>
          <Route
            path={`${pathname}/collections/:status(drafts|review|published|archived)/`}
          >
            <CollectionListPage />
          </Route>
          <Route path={`${pathname}/collections/:id/`}>
            <CollectionPage />
          </Route>
          <Route path={`${pathname}/partners/`}>
            <PartnerListPage />
          </Route>
          <Route path={`${pathname}/partners/add/`}>
            <AddPartnerPage />
          </Route>
          <Route path={`${pathname}/partners/:id`}>
            <PartnerPage />
          </Route>
          <Route path={`${pathname}/search/`}>
            <CollectionSearchPage />
          </Route>
        </Routes>
      </MainContentWrapper>
    </ApolloProvider>
  );
};
