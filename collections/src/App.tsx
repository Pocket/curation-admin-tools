import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { HomePage } from './pages';
import { Header, MainContentWrapper } from './components';
function App(): JSX.Element {
  return (
    <BrowserRouter>
      <>
        <Header />
        <MainContentWrapper>
          <Switch>
            <Route exact path="/">
              <HomePage />
            </Route>
          </Switch>
        </MainContentWrapper>
      </>
    </BrowserRouter>
  );
}

export default App;
