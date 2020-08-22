import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import * as reducers from './../Redux';
import {connectRouter, routerMiddleware} from "connected-react-router";
import history from "./history";

const appReducer = combineReducers({ ...reducers, router: connectRouter(history) });
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const historyMiddleware = composeEnhancers(applyMiddleware(routerMiddleware(history)));

const reduxStore = createStore(appReducer, historyMiddleware);

export default reduxStore;
