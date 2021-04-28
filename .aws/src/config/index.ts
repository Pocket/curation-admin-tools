const name = 'CurationAdminTools';
const domainPrefix = 'curation-admin-tools';
const devDomain = 'getpocket.dev';
const prodDomain = 'readitlater.com';
const isDev = process.env.NODE_ENV === 'development';
const environment = isDev ? 'Dev' : 'Prod';
const domain = `${domainPrefix}.` + (isDev ? devDomain : prodDomain);
const collectionApiEndpoint = 'https://collection-api.' + (isDev ? devDomain : prodDomain) + '/admin';
// We use production client api always,
// because the dev one will not have item data and that is all we are going to use it for
const clientApiEndpoint = 'https://client-api.getpocket.com';

export const config = {
  name,
  prefix: `${name}-${environment}`,
  circleCIPrefix: `/${name}/CircleCI/${environment}`,
  shortName: 'CURADM',
  environment,
  domain,
  envVars: {
    collectionApiEndpoint,
    clientApiEndpoint
  },
  tags: {
    service: name,
    environment
  }
};
