import React from 'react';
import {Route, Redirect} from "react-router-dom";
import Url from "./url";
import {isLoggedIn} from "./helper";

export function PrivateRoute({ component: Component, ...rest }) {
    return (
        <Route
            {...rest}
            render={routeProps => (
                isLoggedIn()
                    ? <Component {...routeProps} />
                    : <Redirect to={{pathname: Url.Login, state: { from: routeProps.location }}} />
        )}/>
    );
}
