import React from 'react';
import App from './App';

import { AuthProvider, AuthService, useAuth } from 'react-oauth2-pkce';
import { config } from './config';

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
    return (
      <div>
        <p>Not Logged in yet</p>
        <button onClick={login}>Login</button>
      </div>
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
