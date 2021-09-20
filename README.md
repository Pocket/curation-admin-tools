# Curation Admin Tools - A Suite 🎩

This repository is home to a suite of internal tools for Pocket curators developed with React.

## Local Setup

Check out the repository and install packages:

```bash
git clone git@github.com:Pocket/curation-admin-tools.git
cd curation-admin-tools
npm install
```

Add a file with an environment variable so that the app can connect to the API. Environment variables in React must start with the `REACT_APP_` prefix (read more [here](https://create-react-app.dev/docs/adding-custom-environment-variables/)).

Create an `.env` file in the root of the project and add the following lines to it:

```dotenv
REACT_APP_CLIENT_API_ENDPOINT="[YOUR_CLIENT_API_ADDRESS_HERE]"
REACT_APP_COLLECTION_API_ENDPOINT="[YOUR_COLLECTION_API_ADDRESS_HERE]"
```

_Tip_: it is easiest to work with the Curation Tools Frontend by pointing to production Client API and spinning up Collection API locally. For setting up Collection API on your machine, refer to instructions here: https://github.com/Pocket/collection-api.

However, if you need to test image uploads, the best option is to connect to the Dev Collection API which sends images to S3 just like the production code does. Make sure the `dev` branch is up-to-date before using the Dev environment. If it's a number of commits behind, check out the `main` branch locally, make sure you have the latest code and deploy it to Dev:

```bash
cd collection-api
git checkout main
git pull
git push -f origin main:dev
```

Start the React app:

```bash
npm start
```

The app will open in your default browser at [http://localhost:3000](http://localhost:3000).

## Testing

To run the tests in watch mode, run the following command:

```bash
npm run test
```

## App structure

The `src/_shared` folder houses the basic building blocks of the app, such as any UI components that can be reused across different tools, useful helper functions and React hooks.

`src/collections` is the home for Collections Admin Tool that lets Pocket curators create, edit and publish collections of stories for Pocket users.

`src/prospects` will house the new Prospecting Tool (_details TBA_).

Within the folder for each tool, the structure is as follows (taking Collections as an example):

```bash
collections/
├─ api/
│  ├─ client-api/
│  ├─ collection-api/
├─ components/
├─ pages/
├─ utils/
```

Each API endpoint has its own folder with queries and mutations used with that endpoint, connection setup and generated types - see below in more detail about those.

The `components` folder houses any components specific to that particular tool, for example, `CollectionListCard`. The `pages` folder is home to page-level components, i.e. `AddCollectionPage`.

All components are functional React components. Each component lives in its own folder. Unit tests, styles, validation schemas (for form components) are placed in separate files alongside each component.

## Consuming data

### Adding a new API

To add a new API for the frontend to consume data from, follow these steps:

- Create a new folder under `src/[PROJECT]/api`. The naming convention is `[NEW-API-NAME]-api`, i.e. `collection-api` or `client-api`.

- In this folder, create a new `client.ts` file, specifying configuration options for the Apollo Client to connect to the new API.

- Place your GraphQL queries, mutations and fragments in the new API folder. While not strictly necessary, the existing APIs use separate folders for these, i.e. `src/api/collection-api/fragments`, `src/api/collection-api/queries` and `src/api/collection-api/mutations`.

The next step is to set up type generation for everything you're going to use in the new API. [GraphQL Code Generator](https://www.graphql-code-generator.com/) saves a lot of development time by generating all the types the frontend needs to display and manipulate data coming from a GraphQL API, and also creates convenient hooks for both queries and mutations.

- Under `src/[PROJECT]/config`, create a new GraphQL Code Generator config file following the format of the existing config files there. You need to specify the endpoint for the new API and make sure the `documents` array is pointing to the correct folders, i.e. `src/api/brand-new-api/queries`, etc. and that the Prettier hook at the bottom of the config file also points to the correct `generatedTypes.ts` file.

- Add a shorthand command to `package.json` to run the code generation script:

```bash
"api:generate-[NEW-API-NAME]-types": "graphql-codegen --config src/[PROJECT]/config/[NEW-API-NAME]-api-codegen.json -r dotenv/config"
```

- Make sure sure the frontend can reach the endpoint of the API first if it's not publicly available and run the script:

```bash
npm run api:generate-[NEW-API-NAME]-types
```

This will create and format a `generatedTypes.ts` file in your API folder. Do not make changes to this file as they will be overwritten the next time the script is used.

The frontend app code should only ever need to import from the following files:
- `client.ts`, from where you can import the Apollo Client config to connect to the new API,
- `generatedTypes.ts` that have all the entity and enum types, copies of the queries, mutations and fragments that may be needed to be passed to Apollo, especially in tests, and custom hooks on top of Apollo's `useMutation`, `useQuery` and `useLazyQuery`.

### Keeping types for existing APIs in sync

If the GraphQL schema of the API changes, or if you add new queries, mutations or fragments to the repository under `src/api`, you need to re-run the relevant type generation script. Note that the following command needs the API to be available at the address defined in our `.env` above:

To refresh types for Collection API, run

```bash
npm run api:generate-collection-types
```

To update types for Client API, run

```bash
npm run api:generate-client-types
```

The generated types are saved in a file named `generatedTypes.ts` in the relevant API folder and automatically formatted with Prettier. Check in the changes to the repository but do not edit this file as the next time the types will be regenerated any updates you make will be lost.
