import React, {useState} from 'react';
import connect from 'react-redux/es/connect/connect';
import { replace } from 'connected-react-router'
import MyInput from "../Components/myInput";
import MyButton from "../Components/myButton";
import {addUser} from "../Redux/modules/users";
import Url from "../JS/url";
import {guestLogin, login} from "../Api/login";
import {updateLoggedInUserId} from "../Redux/modules/additionalInfo";
import {batch} from "react-redux";
import User from "../Models/user";
import Error from "../Components/error";
import GoBack from "../Components/back";
import Ruler from "../Components/ruler";

const Login = (props) => {
    const [user, _setUser] = useState(new User());
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const setUser = (e) => {
        user.set(e.target.name, e.target.value);
        _setUser(user);
    };

    const onLogin = async () => {
        setError(null);
        if (!user.isValidForLogin() || isLoading) {
            return;
        }

        setLoading(true);
        await performLogin();
        setLoading(false);
    };

    const onGuestLogin = async () => {
        if (!user.isValidForGuestLogin() || isLoading) {
            return;
        }

        setLoading(true);
        const response = await guestLogin(user.get('email'));
        await saveUserProfile(response);
        setLoading(false);

        props.dispatch(replace(Url.LandingPage));
    };

    const isValidResponse = (response) => {
        const parsedResponse = response.response;
        return !(parsedResponse && parsedResponse.data && parsedResponse.data.errors);
    };

    const saveUserProfile = async (response) => {
        const userProfile = response.data;
        await window.setToken(userProfile['token']);

        await batch(async () => {
            props.dispatch(addUser([userProfile]));
            props.dispatch(updateLoggedInUserId(userProfile.id));
        });

    };
    const performLogin = async () => {
        const response = await login(user.attributes);
        if (!isValidResponse(response)) {
            setError('Error in Login');
            return;
        }

        await saveUserProfile(response);
        props.dispatch(replace(Url.LandingPage));
    };

    return (
        <div className="login-container">
            <div className="login">
                <GoBack url={Url.Home}/>
                <Error error={error} />
                {/*<MyInput*/}
                {/*    type='text'*/}
                {/*    name='email'*/}
                {/*    placeholder='Email'*/}
                {/*    onChangeText={setUser}*/}
                {/*/>*/}
                {/*<MyInput*/}
                {/*    type='password'*/}
                {/*    name='password'*/}
                {/*    placeholder='Password'*/}
                {/*    onChangeText={setUser}*/}
                {/*/>*/}
                {/*<MyButton*/}
                {/*    loading={isLoading}*/}
                {/*    onClick={onLogin}*/}
                {/*    label='Login'*/}
                {/*/>*/}
                {/*<Ruler/>*/}
                <MyInput
                    type='text'
                    name='email'
                    placeholder='name'
                    onChangeText={setUser}
                />
                <MyButton
                    loading={isLoading}
                    onClick={onGuestLogin}
                    label='Login'
                />
            </div>

        </div>
    );
}

export default connect()(Login);
