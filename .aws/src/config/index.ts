const name = 'CurationAdminTools';
const domainPrefix = 'curation-admin-tools';
const devDomain = 'getpocket.dev';
const prodDomain = 'readitlater.com';
const isDev = process.env.NODE_ENV === 'development';
const environment = isDev ? 'Dev' : 'Prod';
const domain = `${domainPrefix}.` + (isDev ? devDomain : prodDomain);
const collectionApiEndpoint = 'https://collection-api.' + (isDev ? devDomain : prodDomain) + '/admin';

export const config = {
  name,
  prefix: `${name}-${environment}`,
  circleCIPrefix: `/${name}/CircleCI/${environment}`,
  shortName: 'CURADM',
  environment,
  domain,
  envVars: {
    collectionApiEndpoint
  },
  tags: {
    service: name,
    environment
  }
};
