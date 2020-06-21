import React from 'react';
import ReactDOM from 'react-dom';
import history from './history';
import { createStore, combineReducers } from 'redux';
import Provider from 'react-redux/es/components/Provider';
import './Styles/index.css';
import * as reducers from './Redux';
import {connectRouter} from "connected-react-router";
import Router from "./router";
import {addInterceptor} from "./Api/api";

const appReducer = combineReducers({ ...reducers, router: connectRouter(history) });
function rootReducer(state, action) {
    return appReducer(state, action);
}

export const store = createStore(rootReducer,
    {},
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

window.getToken = () => {
    return localStorage.getItem('token');
};

window.setToken = (token) => {
    localStorage.setItem('token', token);
};

window.logout = () => {
    window.setToken('');
    window.setRoomCode('');
};

window.setRoomCode = (roomCode) => {
    localStorage.setItem('currentRoomCode', roomCode);
};

window.getRoomCode = () => {
    return localStorage.getItem('currentRoomCode');
};

window.apiUrl = () => `http://${window.location.hostname}:8000`;


addInterceptor();

ReactDOM.render(
    <Provider store={store}>
        <Router />
    </Provider>,
  document.getElementById('root')
);
