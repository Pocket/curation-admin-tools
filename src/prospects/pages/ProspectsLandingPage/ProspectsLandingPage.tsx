import React from 'react';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import {
  Header,
  MainContentWrapper,
  MenuLink,
} from '../../../_shared/components';
import { CuratedItemsPage } from '../';
import { client } from '../../../prospects/api/curated-corpus-api/client';
import { ApolloProvider } from '@apollo/client';

/**
 * Prospects landing page
 */
export const ProspectsLandingPage = (): JSX.Element => {
  // Get the base path (/prospects)
  const { path } = useRouteMatch();

  const menuLinks: MenuLink[] = [
    {
      text: 'Prospects',
      url: `${path}/prospects/`,
    },
    {
      text: 'Corpus',
      url: `${path}/corpus/`,
    },
  ];

  return (
    <ApolloProvider client={client}>
      <Header productName="Prospect Curation" menuLinks={menuLinks} />
      <MainContentWrapper>
        <Switch>
          <Route exact path={`${path}/`}>
            <h2>Prospects landing page!</h2>
            <p>
              Try going to the <Link to={`${path}/corpus/`}>Corpus</Link> page
            </p>
          </Route>
          <Route exact path={`${path}/corpus/`}>
            <CuratedItemsPage />
          </Route>
        </Switch>
      </MainContentWrapper>
    </ApolloProvider>
  );
};
