import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/react';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { config } from './config';
import SecuredApp from './SecuredApp';

Sentry.init({
  dsn: config.sentryDSN,
  release: config.version,
  environment: config.environment,
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 0.01,
});

ReactDOM.render(
  <React.StrictMode>
    <SecuredApp />
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
