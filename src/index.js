import React from 'react';
import ReactDOM from 'react-dom';
import history from './JS/history';
import Provider from 'react-redux/es/components/Provider';
import './index.css';
import {ConnectedRouter} from "connected-react-router";
import Router from "./JS/router";
import {addInterceptor} from "./Api/api";
import reduxStore from "./JS/store";
import Url from "./JS/url";
import * as Sentry from "@sentry/react";

export const store = reduxStore;

window.logout = () => {
    window.setToken('');
    window.setRoomCode('');
    window.location.replace(window.location.host + Url.Login);
};

window.isDev = () => false;
window.getToken = () => {
    return localStorage.getItem('token');
};

window.setToken = (token) => {
    localStorage.setItem('token', token);
};

window.setRoomCode = (code) => {
    localStorage.setItem('room-code', code);
};

window.getRoomCode = () => {
    return localStorage.getItem('room-code');
};

window.apiUrl = () => `https://dehla-pakad-api.eightbitguy.in`;

addInterceptor();

Sentry.init({
  dsn: window._env_.SENTRY_KEY,
  integrations: [
    new Sentry.BrowserTracing({
      // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: [/^https:\/\/dehla-pakad-ui.eightbitguy\.in/],
    }),
    new Sentry.Replay(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <Router />
        </ConnectedRouter>
    </Provider>,
  document.getElementById('root')
);
