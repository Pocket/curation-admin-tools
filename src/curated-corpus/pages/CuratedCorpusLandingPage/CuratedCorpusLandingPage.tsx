import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import { List, ListItem, ListItemText } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import LuxonUtils from '@date-io/luxon';
import {
  Header,
  MainContentWrapper,
  MenuLink,
} from '../../../_shared/components';
import {
  ApprovedItemsPage,
  ProspectingPage,
  RejectedItemsPage,
  SchedulePage,
} from '../';
import { client } from '../../api/curated-corpus-api/client';

/**
 * Curated Corpus landing page
 */
export const CuratedCorpusLandingPage = (): JSX.Element => {
  // Get the base path (/curated-corpus)
  const { pathname } = useLocation();
  const path = pathname;
  console.log(path);

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
        <Header
          productName="Curated Corpus"
          productLink="/curated-corpus"
          menuLinks={menuLinks}
        />
        <MainContentWrapper>
          <Routes>
            <Route path={`${path}/`}>
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
            <Route path={`${path}/prospecting/`}>
              <ProspectingPage />
            </Route>
            <Route path={`${path}/schedule/`}>
              <SchedulePage />
            </Route>
            <Route path={`${path}/corpus/`}>
              <ApprovedItemsPage />
            </Route>
            <Route path={`${path}/rejected/`}>
              <RejectedItemsPage />
            </Route>
          </Routes>
        </MainContentWrapper>
      </MuiPickersUtilsProvider>
    </ApolloProvider>
  );
};
