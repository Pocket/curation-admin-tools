import '../processPolyfill';

const isProduction = process.env.REACT_APP_ENV === 'production';

export const config = {
  apolloClientName: `CurationAdminTools`,
  version: `${process.env.REACT_APP_GIT_SHA ?? 'local'}`,
  // If we have an env variable set, let's use it. Otherwise, if we are production,
  // let's use the production API, otherwise use the dev API.
  adminApiEndpoint: `${
    process.env.REACT_APP_ADMIN_API_ENDPOINT ??
    (isProduction
      ? 'https://admin-api.getpocket.com'
      : 'https://admin-api.getpocket.dev')
  }`,
  // The OAuth provider is the same for both dev and production environments.
  oauth2: {
    provider: `${
      process.env.REACT_APP_OAUTH2_PROVIDER ??
      'https://mozilla-auth-proxy.getpocket.com/oauth2'
    }`,
    // So is the client ID
    clientId: `${
      process.env.REACT_APP_OAUTH2_CLIENT_ID ?? '5qgiui93mdakahca0rvvtsi3ar'
    }`,
    logoutEndpoint: `${
      process.env.REACT_APP_OAUTH2_LOGOUT_ENDPOINT ??
      'https://mozilla-auth-proxy.getpocket.com/logout'
    }`,
    redirectUri: `${
      process.env.REACT_APP_OAUTH2_REDIRECT_URI ??
      (isProduction
        ? 'https://curation-admin-tools.readitlater.com/oauth/callback'
        : 'https://curation-admin-tools.getpocket.dev/oauth/callback')
    }`,
  },
  environment: process.env.NODE_ENV,
  pagination: {
    // To display four items in a row, 32 is a better choice than 30 which gives us 7 1/2 rows.
    curatedItemsPerPage: 32,
    rejectedItemsPerPage: 32,
    valuesPerDropdown: 1000,
  },
  //Not a secret since the  app is client side
  sentryDSN:
    'https://6331b9a9a35f79b18484e59eb9e33517@o1069899.ingest.us.sentry.io/4510959176318976',
  isProduction,
};
