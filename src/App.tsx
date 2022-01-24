import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import { SnackbarProvider } from 'notistack';
import theme from './theme';

import { LandingPage } from './_shared/pages';
import { CollectionsLandingPage } from './collections/pages';
import { CuratedCorpusLandingPage } from './curated-corpus/pages';

function App(): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/collections" element={<CollectionsLandingPage />} />
            <Route
              path="/curated-corpus"
              element={<CuratedCorpusLandingPage />}
            />
          </Routes>
        </BrowserRouter>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
