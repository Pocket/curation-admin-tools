const isProduction = process.env.REACT_APP_ENV === 'production';

export const config = {
  apolloClientName: `CurationAdminToolsCollections`,
  version: `${process.env.REACT_APP_GIT_SHA ?? 'local'}`,
  //If we have an env variable set, lets use it. Otherwise if we are production, lets you the prod api, otherwise use the dev api
  collectionApiEndpoint: `${
    process.env.REACT_APP_COLLECTION_API_ENDPOINT ??
    (isProduction
      ? 'https://collection-api.readitlater.com/admin'
      : 'https://collection-api.getpocket.dev/admin')
  }`,
  curatedCorpusApiEndpoint: `${
    process.env.REACT_APP_CURATED_CORPUS_API_ENDPOINT ??
    (isProduction
      ? 'https://curated-corpus-api.readitlater.com/admin'
      : 'https://curated-corpus-api.getpocket.dev/admin')
  }`,
  //Client api only exists on production
  clientApiEndpoint: `${
    process.env.REACT_APP_CLIENT_API_ENDPOINT ??
    'https://client-api.getpocket.com'
  }`,
  environment: process.env.NODE_ENV,
  pagination: {
    authorsPerPage: 30,
    collectionsPerPage: 30,
    partnersPerPage: 30,
    // To display four items in a row, 32 is a better choice than 30 which gives us 7 1/2 rows.
    curatedItemsPerPage: 32,
    rejectedItemsPerPage: 32,
    valuesPerDropdown: 1000,
  },
  //Not a secret since the  app is client side
  sentryDSN:
    'https://cab6b9b6144345ac8b5c045d0c51834c@o28549.ingest.sentry.io/5726568',
  slugify: {
    // use lowercase for slugs
    lower: true,
    // remove all punctuation, both Unicode (i.e., curly quotes) and standard US-ASCII
    remove: /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-./:;<=>?@[\]^_`{|}~]/g,
    // strip special characters except the replacement character
    // (we use the default dash: -)
    strict: true,
  },
};
