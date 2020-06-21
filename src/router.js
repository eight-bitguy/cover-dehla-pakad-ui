import './Styles/styles.css';
import React, {Component} from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Url from "./url";
import connect from 'react-redux/es/connect/connect';
import Register from "./Pages/register";
import Login from "./Pages/login";
import { PrivateRoute } from "./PrivateRoute";
import WorkspaceContainer from "./Pages/WorkspaceContainer";
import GamePage from "./Pages/gamePage";
import {getMe} from "./Api/user";
import {addUser} from "./Redux/modules/users";
import {updateLoggedInUserId} from "./Redux/modules/additionalInfo";
import {batch} from "react-redux";

class Router extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isChecking: true
        };
    }

    getUser = async () => {
        const {data: userProfile} = await getMe();

        if (userProfile) {
            await batch(async () => {
                await this.props.dispatch(addUser([userProfile]));
                await this.props.dispatch(updateLoggedInUserId(userProfile.id));
            });
        }
        else {
            window.setToken('');
        }

        this.setState({isChecking: false});
    };

    componentDidMount() {
        this.getUser();
    }

    render() {
        if (this.state.isChecking) {
            return <div />;
        }
        return (
            <BrowserRouter>
                <main>
                    <Switch>
                        <Route exact path={Url.Register} component={Register}/>
                        <Route exact path={Url.Login} component={Login}/>
                        <PrivateRoute path='/' component={WorkspaceContainer} />
                    </Switch>
                </main>
            </BrowserRouter>
        );
    }
}

export default connect()(Router)
