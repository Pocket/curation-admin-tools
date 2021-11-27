const name = 'CurationAdminTools';
const domainPrefix = 'curation-admin-tools';
const devDomain = 'getpocket.dev';
const prodDomain = 'readitlater.com';
export const isDev = process.env.NODE_ENV === 'development';
const environment = isDev ? 'Dev' : 'Prod';
const domain = `${domainPrefix}.` + (isDev ? devDomain : prodDomain);
const collectionApiEndpoint =
  'https://collection-api.' + (isDev ? devDomain : prodDomain) + '/admin';
// We use production client api always,
// because the dev one will not have item data and that is all we are going to use it for
const clientApiEndpoint = 'https://client-api.getpocket.com';
const githubConnectionArn = isDev
  ? 'arn:aws:codestar-connections:us-east-1:410318598490:connection/7426c139-1aa0-49e2-aabc-5aef11092032'
  : 'arn:aws:codestar-connections:us-east-1:996905175585:connection/5fa5aa2b-a2d2-43e3-ab5a-72ececfc1870';
const branch = isDev ? 'dev' : 'main';

// We use the production client always because all it does is authenticate us and is public
const oauth2ClientId = '6qt94s9d651k24mvul9q2lbrcv';
const oauth2Provider =
  'https://pocket-admin-prod.auth.us-east-1.amazoncognito.com/oauth2';
const oauth2RedirectUri = `${domain}/oauth/callback`;

export const config = {
  name,
  prefix: `${name}-${environment}`,
  circleCIPrefix: `/${name}/CircleCI/${environment}`,
  shortName: 'CURADM',
  environment,
  domain,
  codePipeline: {
    githubConnectionArn,
    repository: 'pocket/curation-admin-tools',
    branch,
  },
  envVars: {
    collectionApiEndpoint,
    clientApiEndpoint,
    oauth2ClientId,
    oauth2Provider,
    oauth2RedirectUri,
  },
  tags: {
    service: name,
    environment,
  },
};
