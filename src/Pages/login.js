import React, {useState} from 'react';
import connect from 'react-redux/es/connect/connect';
import { replace } from 'connected-react-router'
import MyInput from "../Components/myInput";
import MyButton from "../Components/myButton";
import {addUser} from "../Redux/modules/users";
import Url from "../JS/url";
import { login } from "../Api/login";
import {updateLoggedInUserId} from "../Redux/modules/additionalInfo";
import {batch} from "react-redux";
import User from "../Models/user";

const Login = (props) => {
    const [user, _setUser] = useState(new User());
    const [isLoading, setLoading] = useState(false);

    const setUser = (e) => {
        user.set(e.target.name, e.target.value);
        _setUser(user);
    };

    const onLogin = async () => {
        if (!user.isValidForLogin()) {
            return;
        }

        setLoading(true);
        const response = await login(user.attributes);

        if (!response.data) {
            setLoading(false);
            return;
        }

        const userProfile = response.data;
        await window.setToken(userProfile['token']);

        await batch(async () => {
            await props.dispatch(addUser([userProfile]));
            await props.dispatch(updateLoggedInUserId(userProfile.id));
        });
        setLoading(false);
        props.dispatch(replace(Url.LandingPage));
    };

    return (
        <div className="login-container">
            <div className="login">
                <MyInput
                    type='text'
                    name='email'
                    placeholder='Email'
                    onChangeText={setUser}
                />
                <MyInput
                    type='password'
                    name='password'
                    placeholder='Password'
                    onChangeText={setUser}
                />
                <MyButton
                    loading={isLoading}
                    onClick={onLogin}
                    label='Login'
                />
            </div>
        </div>
    );
}

export default connect()(Login);
