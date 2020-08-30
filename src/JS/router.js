import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Url from "./url";
import connect from 'react-redux/es/connect/connect';
import { PrivateRoute } from "./PrivateRoute";
import PageLoadable from "../Components/loadable";

const Login = PageLoadable({ loader: () => import("../Pages/login") });
const Register = PageLoadable({ loader: () => import("../Pages/register") });
const WorkspaceContainer = PageLoadable({ loader: () => import("../Pages/WorkspaceContainer") });
const HomePage = PageLoadable({ loader: () => import("../Pages/homePage") });

const Router = () => {
    return (
        <div className='router'>
            <div className='router-app'>
                <main>
                    <Switch>
                        <Route exact path={Url.Register} component={Register}/>
                        <Route exact path={Url.Login} component={Login}/>
                        <Route exact path={Url.Home} component={HomePage}/>
                        <PrivateRoute path='/' component={WorkspaceContainer} />
                    </Switch>
                </main>
            </div>
        </div>
    );
};

export default connect()(Router);
