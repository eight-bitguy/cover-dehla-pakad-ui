import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Url from "./url";
import connect from 'react-redux/es/connect/connect';
import Register from "../Pages/register";
import Login from "../Pages/login";
import { PrivateRoute } from "./PrivateRoute";
import WorkspaceContainer from "../Pages/WorkspaceContainer";

const Router = (props) => {
    return (
        <div className='router'>
            <main>
                <Switch>
                    <Route exact path={Url.Register} component={Register}/>
                    <Route exact path={Url.Login} component={Login}/>
                    <PrivateRoute path='/' component={WorkspaceContainer} />
                </Switch>
            </main>
        </div>
    );
};

export default connect()(Router);
