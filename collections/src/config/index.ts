const isProduction = process.env.NODE_ENV === 'production';

export const config = {
  apolloClientName: `CurationAdminToolsCollections`,
  version: `${process.env.REACT_APP_GIT_SHA ?? 'local'}`,
  //If we have an env variable set, lets use it. Otherwise if we are production, lets you the prod api, otherwise use the dev api
  collectionApiEndpoint: `${process.env.REACT_APP_COLLECTION_API_ENDPOINT ?? isProduction ? 'https://collection-api.readitlater.com/admin' : 'https://collection-api.getpocket.dev/admin'}`,
  //Client api only exists on production
  clientApiEndpoint: `${process.env.REACT_APP_CLIENT_API_ENDPOINT ?? 'https://client-api.getpocket.com'}`,
  environment: process.env.NODE_ENV,
  //Not a secret since the  app is client side
  sentryDSN: 'https://cab6b9b6144345ac8b5c045d0c51834c@o28549.ingest.sentry.io/5726568'
};
