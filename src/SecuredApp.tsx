import React from 'react';
import App from './App';

import { AuthProvider, AuthService, useAuth } from 'react-oauth2-pkce';
import { config } from './config';
import { Box, Grid } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { Button } from './_shared/components';
import theme from './theme';
import mozillaLogo from './_shared/assets/mozilla-logo-bw-rgb.png';

const authService = new AuthService({
  location: window.location,
  clientId: config.oauth2.clientId,
  provider: config.oauth2.provider,
  redirectUri: config.oauth2.redirectUri,
  logoutEndpoint: config.oauth2.logoutEndpoint,
  autoRefresh: true,
  scopes: ['openid', 'profile'],
});

const SecuredApp = (): JSX.Element => {
  //Note the main app needs to use the main hook from react-pkce and not our custom one in shared.
  const { authService } = useAuth();

  const login = async () => authService.authorize();

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
                style={{ width: '180px', padding: '1em' }}
                src={mozillaLogo}
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
