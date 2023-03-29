import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import { List, ListItem, ListItemText } from '@mui/material';
import {
  HeaderConnector,
  MenuLink,
  PageNotFound,
} from '../../../_shared/components';
import { StyledContainer } from '../../../_shared/styled';
import { client } from '../../../api/client';
import { SearchShareableListsPage } from '../';

/**
 * Moderation landing page
 */
export const ModerationLandingPage = (): JSX.Element => {
  // Get the base path (/moderation)
  const { path } = useRouteMatch();

  const menuLinks: MenuLink[] = [
    {
      text: 'Search',
      url: `${path}/search/`,
    },
    {
      text: 'Users',
      url: `${path}/users/`,
    },
  ];

  return (
    <ApolloProvider client={client}>
      <HeaderConnector
        productName="Moderation"
        productLink="/moderation"
        menuLinks={menuLinks}
      />
      <StyledContainer maxWidth="xl" disableGutters>
        <Switch>
          <Route exact path={`${path}/`}>
            <h2>Welcome to Pocket&apos;s Shareable Lists Moderation tool.</h2>

            <p>Use the menu above to navigate:</p>

            <List>
              <ListItem>
                <ListItemText>
                  The <Link to={`${path}/search/`}>Search</Link> page will let
                  you look up and moderate shareable lists.
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>
                  The <Link to={`${path}/users/`}>Users</Link> page will allow
                  you to manage access to the feature during the Pilot phase.
                </ListItemText>
              </ListItem>
            </List>
          </Route>
          <Route exact path={`${path}/search/`}>
            <SearchShareableListsPage />
          </Route>
          {/*<Route exact path={`${path}/users/`}>*/}
          {/*  <ManagePilotUsersPage />*/}
          {/*</Route>*/}
          <Route component={PageNotFound} />
        </Switch>
      </StyledContainer>
    </ApolloProvider>
  );
};
