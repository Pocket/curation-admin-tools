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
import { ApprovedItemsPage, NewTabCurationPage, RejectedItemsPage } from '../';
import { client } from '../../api/curated-corpus-api/client';

/**
 * Curated Corpus landing page
 */
export const CuratedCorpusLandingPage = (): JSX.Element => {
  // Get the base path (/prospects)
  const { path } = useRouteMatch();

  const menuLinks: MenuLink[] = [
    {
      text: 'New Tab Curation',
      url: `${path}/new-tab/`,
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
            <Route exact path={`${path}/new-tab/`}>
              <NewTabCurationPage />
            </Route>
            <Route exact path={`${path}/live/`}>
              <ApprovedItemsPage />
            </Route>
            <Route exact path={`${path}/rejected/`}>
              <RejectedItemsPage />
            </Route>
          </Switch>
        </MainContentWrapper>
      </MuiPickersUtilsProvider>
    </ApolloProvider>
  );
};
