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

window.apiUrl = () => `https://bf61-2401-4900-1cb9-ed67-f87a-1ac0-3176-2c0b.ngrok-free.app`;

addInterceptor();
ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <Router />
        </ConnectedRouter>
    </Provider>,
  document.getElementById('root')
);
