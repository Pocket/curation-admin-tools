import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import { List, ListItem, ListItemText } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import LuxonUtils from '@date-io/luxon';
import {
  HeaderConnector,
  MainContentWrapper,
  MenuLink,
  PageNotFound,
} from '../../../_shared/components';
import { CorpusPage, ProspectingPage, RejectedPage, SchedulePage } from '../';
import { client } from '../../../api/client';

/**
 * Curated Corpus landing page
 */
export const CuratedCorpusLandingPage = (): JSX.Element => {
  // Get the base path (/curated-corpus)
  const { path } = useRouteMatch();

  const menuLinks: MenuLink[] = [
    {
      text: 'Prospecting',
      url: `${path}/prospecting/`,
    },
    {
      text: 'Schedule',
      url: `${path}/schedule/`,
    },
    {
      text: 'Corpus',
      url: `${path}/corpus/`,
    },
    {
      text: 'Rejected',
      url: `${path}/rejected/`,
    },
  ];

  return (
    <ApolloProvider client={client}>
      <MuiPickersUtilsProvider utils={LuxonUtils}>
        <HeaderConnector
          productName="Curated Corpus"
          productLink="/curated-corpus"
          menuLinks={menuLinks}
        />
        <MainContentWrapper>
          <Switch>
            <Route exact path={`${path}/`}>
              <h2>Welcome to Pocket&apos;s Curated Corpus management tool.</h2>

              <p>Use the menu above to nagivate:</p>

              <List>
                <ListItem>
                  <ListItemText>
                    <Link to={`${path}/prospecting/`}>Prospecting</Link> is
                    where you&apos;ll view items suggested by our ML team to
                    either approve and add to our corpus, or reject.
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemText>
                    <Link to={`${path}/schedule/`}>Schedule</Link> will show you
                    all currently scheduled items.
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemText>
                    <Link to={`${path}/corpus/`}>Corpus</Link> will let you
                    browse and manage all items currently in our corpus.
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemText>
                    <Link to={`${path}/rejected/`}>Rejected</Link> will show you
                    all prospects that have been rejected.
                  </ListItemText>
                </ListItem>
              </List>
            </Route>
            <Route exact path={`${path}/prospecting/`}>
              <ProspectingPage />
            </Route>
            <Route exact path={`${path}/schedule/`}>
              <SchedulePage />
            </Route>
            <Route exact path={`${path}/corpus/`}>
              <CorpusPage />
            </Route>
            <Route exact path={`${path}/rejected/`}>
              <RejectedPage />
            </Route>
            <Route component={PageNotFound} />
          </Switch>
        </MainContentWrapper>
      </MuiPickersUtilsProvider>
    </ApolloProvider>
  );
};
