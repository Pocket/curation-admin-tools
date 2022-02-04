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
npm ci
```

Next, to enable SSO auth, create an `.env` file in the project root, and add the following:

```
REACT_APP_OAUTH2_REDIRECT_URI=http://localhost:3000/oauth/callback
REACT_APP_OAUTH2_CLIENT_ID=2jliat5ne5043psrlbhur2unlr
```

You're almost there! By default, the app will connect to the production Admin API. To point to the Pocket Development or locally spun up API, you will need to override the default endpoint value in your `.env` file. Add the following to your `.env` file and comment out the endpoint you do not need:

```dotenv
#This is the dev version of the federated graph
REACT_APP_ADMIN_API_ENDPOINT=https://admin-api.getpocket.dev

#A And this is the local version if you need to debug something
# or swap out one of the subgraphs for a locally spun up version.
REACT_APP_ADMIN_API_ENDPOINT=http://localhost:4027
```
Start the React app:

```bash
npm start
```

The app will open in your default browser at [http://localhost:3000](http://localhost:3000).

## Testing the UI on Dev

### Deploying the frontend to Dev

This is useful for user acceptance testing, live demos of as-yet-not-merged features and code reviews by team members outside of your immediate team who may not have the time to go through all of the setup steps to be able to review a pull request.

The Dev checkout is available at [https://curation-admin-tools.getpocket.dev/](https://curation-admin-tools.getpocket.dev/). Note that this address is accessible only via the Pocket Dev VPN.

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

- The `src/api` folder contains GraphQL queries and mutations the app needs to execute to retrieve and manipulate data, as well as generated types for these and the Apollo Client connection.

- `src/collections` is the home for Collections Admin Tool that lets Pocket curators create, edit and publish collections of stories for Pocket users.

- `src/curated-corpus` houses the Curated Corpus Tool.

Within the folder for each tool, the structure is as follows (taking Collections as an example):

```bash
collections/
├─ components/
├─ pages/
├─ utils/
```

The `components` folder houses any components specific to that particular tool, for example, `CollectionListCard`. The `pages` folder is home to page-level components, i.e. `AddCollectionPage`.

All components are functional React components. Each component lives in its own folder. Unit tests, styles, validation schemas (for form components) are placed in separate files alongside each component.

Routing within the app is set up with React Router. The entrypoint to the app, [App.tsx](/src/App.tsx), sets up all requests to be routed to specific paths within the apps - `/collections` for Collections and `/prospects` for the Prospecting tool, for example. More detailed routing, for example, individual collection pages, is set up within the landing page - see [this example for Collections](/src/collections/pages/CollectionsLandingPage/CollectionsLandingPage.tsx)

## Working with the Admin API

If the GraphQL schema of the API changes, or if you add new queries, mutations or fragments to be used on the frontend, you need to re-run the code generation script.

```bash
# to update types for Admin API, run
npm run api:generate-types
```

The generated types and custom hooks are saved in a file named `generatedTypes.ts` in the `src/api` folder and are automatically formatted with Prettier. Check in the changes to the repository but do not edit this file as the next time the types will be regenerated any updates you make will be lost.

Now that the generated code is ready to use, you can:

- Use the generated types elsewhere in the code to type hint the shape of the returned data or data that is expected by components in the app, for example, `Collection` or `CollectionAuthor`.
- Use strongly typed custom Apollo hooks to fetch and manipulate data. Apollo Client has generic `useQuery`, `useLazyQuery`, `useMutation` and `useSubscription` hooks. GraphQL Code Generator builds on that by providing hooks that are specific to the queries and mutations you need to run, for example, `useGetCollectionByExternalIdQuery`.
