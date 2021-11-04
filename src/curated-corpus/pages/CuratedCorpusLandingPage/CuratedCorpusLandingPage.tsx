import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import LuxonUtils from '@date-io/luxon';
import {
  Header,
  MainContentWrapper,
  MenuLink,
} from '../../../_shared/components';
import { CuratedItemsPage, RejectedItemsPage } from '../';
import { client } from '../../api/curated-corpus-api/client';

/**
 * Curated Corpus landing page
 */
export const CuratedCorpusLandingPage = (): JSX.Element => {
  // Get the base path (/prospects)
  const { path } = useRouteMatch();

  const menuLinks: MenuLink[] = [
    {
      text: 'Prospects',
      url: `${path}/prospects/`,
    },
    {
      text: 'Live Corpus',
      url: `${path}/live/`,
    },
    {
      text: 'Rejected Corpus',
      url: `${path}/rejected`,
    },
  ];

  return (
    <ApolloProvider client={client}>
      <MuiPickersUtilsProvider utils={LuxonUtils}>
        <Header productName="Curated Corpus" menuLinks={menuLinks} />
        <MainContentWrapper>
          <Switch>
            <Route exact path={`${path}/`}>
              <h2>Curated Corpus landing page!</h2>
              <p>
                Try the <Link to={`${path}/live/`}>Live Corpus</Link> page
              </p>
            </Route>
            <Route exact path={`${path}/live/`}>
              <CuratedItemsPage />
            </Route>
            <Route exact path={`${path}/rejected-items/`}>
              <RejectedItemsPage />
            </Route>
          </Switch>
        </MainContentWrapper>
      </MuiPickersUtilsProvider>
    </ApolloProvider>
  );
};
