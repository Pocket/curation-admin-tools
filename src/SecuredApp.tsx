import React from 'react';
import App from './App';

import { AuthProvider, AuthService, useAuth } from 'react-oauth2-pkce';
import { config } from './config';
import { Box, Grid } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { Button } from './_shared/components';
import theme from './theme';
import pocketLogo from './_shared/assets/PKTLogoRounded_RGB.png';

const authService = new AuthService({
  location: window.location,
  clientId: config.oauth2.clientId,
  provider: config.oauth2.provider,
  redirectUri: config.oauth2.redirectUri,
  autoRefresh: true,
  scopes: ['openid', 'profile'],
});

const SecuredApp = (): JSX.Element => {
  //Note the main app needs to use the main hook from react-pkce and not our custom one in shared.
  const { authService } = useAuth();

  const login = async () => authService.authorize();
  const logout = async () => authService.logout();

  if (authService.isPending()) {
    return <div>Loading...</div>;
  }

  if (!authService.isAuthenticated()) {
    // The beginnings of a proper login page
    return (
      <ThemeProvider theme={theme}>
        <Grid
          container
          spacing={0}
          direction="row"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: '65vh' }}
        >
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center">
              <img
                style={{ width: '200px' }}
                src={pocketLogo}
                alt="Home Page"
              />
            </Box>
            <Box display="flex" justifyContent="center">
              <Button color="primary" size="large" onClick={login}>
                Log In
              </Button>
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    );
  }

  return (
    <div>
      <button onClick={logout}>Logout</button>
      <App />
    </div>
  );
};

function WrappedSecuredApp(): JSX.Element {
  return (
    <AuthProvider authService={authService}>
      <SecuredApp />
    </AuthProvider>
  );
}

export default WrappedSecuredApp;
