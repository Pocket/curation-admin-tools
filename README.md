# Curation Admin Tools - A Suite 🎩

This repository is home to a suite of internal tools for Pocket curators developed with React and TypeScript. With React, we use functional components and hooks throughout.

We also use:
- [Material UI](https://mui.com/) for the UI,
- [Apollo Client](https://www.apollographql.com/docs/react/) for connecting to the APIs the tools interact with,
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for unit testing,
- [GraphQL Code Generator](https://www.graphql-code-generator.com/) for generating types and custom Apollo hooks for data that we request from the APIs,
- [Formik](https://formik.org/) as a form builder with [Yup](https://github.com/jquense/yup) for schema validation.

The app runs within the [Create React App](https://create-react-app.dev/) environment. We trade off ability to customize things to our collective heart's content for hassle-free local development.

## Local Setup

Check out the repository and install the required packages:

```bash
git clone git@github.com:Pocket/curation-admin-tools.git
cd curation-admin-tools
npm install
```

You're almost there! By default, the app will connect to production APIs - this works well with Client API, which is public, but not with the rest of the APIs the curation tools use.

_Tip_: it is easiest to work with the Curation Tools Frontend by using the production Client API and spinning up Collection API locally. For setting up Collection API on your machine, refer to [instructions](https://github.com/Pocket/collection-api) in its repository. Proceed largely along the same lines with [Curated Corpus API](https://github.com/Pocket/curated-corpus-api).

Create an `.env` file in the root of the project and add the following lines to it:

```dotenv
REACT_APP_COLLECTION_API_ENDPOINT=http://localhost:4004/admin
REACT_APP_CURATED_CORPUS_API_ENDPOINT=http://localhost:4025/admin
```

Alternatively, connect to the versions of the above API deployed to the Pocket Development environment. Note that you will need to be connected to the Pocket Dev VPN to access these endpoints:

```dotenv
REACT_APP_COLLECTION_API_ENDPOINT=https://collection-api.getpocket.dev/admin
REACT_APP_CURATED_CORPUS_API_ENDPOINT=https://curated-corpus-api.getpocket.dev/admin
```

Start the React app:

```bash
npm start
```

The app will open in your default browser at [http://localhost:3000](http://localhost:3000).

## Testing the UI on Dev

### Using Dev APIs

If you need to test image uploads, the best option is to connect to the Dev Collection API which sends images to S3 just like the production code does. Make sure the `dev` branch is up-to-date before using the Dev environment. If it's a number of commits behind, check out the `main` branch locally, make sure you have the latest code and deploy it to Dev:

```bash
cd collection-api
git checkout main
git pull
git push -f origin main:dev
```

### Deploying the frontend to Dev

This is useful for user acceptance testing, live demos of as-yet-not-merged features and code reviews by team members outside of your immediate team who may not have the time to go through all of the setup steps to be able to review a pull request.

The Dev checkout is available at [https://curation-admin-tools.getpocket.dev/](https://curation-admin-tools.getpocket.dev/). Note that this address is also accessible only via the Pocket Dev VPN.

To deploy the latest changes merged to `main` to Dev, run the following command in your terminal:

```bash
git push -f origin main:dev
```

To push changes from a particular branch to Dev, use the name of the branch instead of `main`:

```bash
git push -f origin your-branch-name:dev
```

## Testing

To run the tests in watch mode, run the following command:

```bash
npm run test
```

## App structure

- The `src/_shared` folder houses the basic building blocks of the app, such as any UI components that can be reused across different tools, useful helper functions and React hooks.

- `src/collections` is the home for Collections Admin Tool that lets Pocket curators create, edit and publish collections of stories for Pocket users.

- `src/prospects` houses the new Prospecting Tool (_currently under development_).

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

Routing within the app is set up with React Router. The entrypoint to the app, [App.tsx](/src/App.tsx), sets up all requests to be routed to specific paths within the apps - `/collections` for Collections and `/prospects` for the Prospecting tool, for example. More detailed routing, for example, individual collection pages, is set up within the landing page - see [this example for Collections](/src/collections/pages/CollectionsLandingPage/CollectionsLandingPage.tsx)

## Consuming data

### Adding a new API

To add a new API for the frontend to consume data from, follow these steps:

- Create a new folder under `src/[PROJECT]/api`. The naming convention is `[NEW-API-NAME]-api`, i.e. `collection-api` or `prospect-api`.

- In this folder, create a new `client.ts` file, specifying configuration options for the Apollo Client to connect to the new API.

- Place your GraphQL queries, mutations and fragments in the new API folder. The convention is to use separate folders for these, i.e.

```bash
src/
├─ collections/
│  ├─ api/
│  │  ├─ collection-api/
│  │  │  ├─ fragments/
│  │  │  ├─ mutations/
│  │  │  ├─ queries/
```

The next step is to set up type generation for everything you're going to use in the new API. [GraphQL Code Generator](https://www.graphql-code-generator.com/) saves a lot of development time by generating all the types the frontend needs to display and manipulate data coming from a GraphQL API, and also creates convenient hooks for both queries and mutations.

- Under `src/config`, create a new GraphQL Code Generator config file following the format of the existing config files there. You need to specify the endpoint for the new API and make sure the `documents` array is pointing to the correct folders, i.e. `src/[PROJECT]/api/[NEW-API-NAME]/queries`, etc. and that the Prettier hook at the bottom of the config file also points to the correct `generatedTypes.ts` file.

- Add a shorthand command to the `scripts` section in `package.json` for running the code generation script:

```json
{
  "scripts": {
    "api:generate-[NEW-API-NAME]-types": "graphql-codegen --config src/[PROJECT]/config/[NEW-API-NAME]-api-codegen.json -r dotenv/config"
  }
}
```

- Make sure the frontend can reach the endpoint of the API first if it's not publicly available and run the script:

```bash
npm run api:generate-[NEW-API-NAME]-types
```

This will create and format a `generatedTypes.ts` file in your API folder. Do not make changes to this file as they will be overwritten the next time the script is used.

The frontend app code should only ever need to import from the following files within the API folders:
- `client.ts`, from where you can import the Apollo Client config to connect to the new API,
- `generatedTypes.ts` that have all the entity and enum types, copies of the queries, mutations and fragments that may be needed to be passed to Apollo, especially in tests, and custom hooks on top of Apollo's `useMutation`, `useQuery` and `useLazyQuery`.

### Working with an existing API

If the GraphQL schema of the API changes, or if you add new queries, mutations or fragments to be used with one or more APIs on the frontend, you need to re-run the relevant type generation script. Note that the following commands needs the relevant API to be available at the address defined in our `.env` above.

```bash
# to update types for Collection API, run
npm run api:generate-collection-types

# same for Curated Corpus API
npm run api:api:generate-curated-corpus-types

# same for Client API
npm run api:generate-client-types
```

The generated types and custom hooks are saved in a file named `generatedTypes.ts` in the corresponding API folder and are automatically formatted with Prettier. Check in the changes to the repository but do not edit this file as the next time the types will be regenerated any updates you make will be lost.

Now that the generated code is ready to use, you can:

- Use the generated types elsewhere in the code to type hint the shape of the returned data or data that is expected by components in the app, for example, `Collection` or `CollectionAuthor`.
- Use strongly typed custom Apollo hooks to fetch and manipulate data. Apollo Client has generic `useQuery`, `useLazyQuery`, `useMutation` and `useSubscription` hooks. GraphQL Code Generator builds on that by providing hooks that are specific to the queries and mutations you need to run, for example, `useGetCollectionByExternalIdQuery`.
