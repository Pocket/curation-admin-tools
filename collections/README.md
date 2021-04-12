## Collections Frontend

### Local Setup

```bash
git clone git@github.com:Pocket/curation-admin-tools.git
cd curation-admin-tools/collections
npm install
npm run api:generate-data
npm run api:start
```

A GraphQL server will start up at [http://localhost:4000/](http://localhost:4000/). Leaving it running, in another terminal window start the React app:

```bash
npm start
```

The app will open in your default browser at [http://localhost:3000](http://localhost:3000).

### Testing

To run the tests, execute

```bash
npm run test
```
