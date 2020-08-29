import React, {useState} from 'react';
import { push } from 'connected-react-router'
import connect from 'react-redux/es/connect/connect';
import MyInput from "../Components/myInput";
import MyButton from "../Components/myButton";
import {registerUser} from "../Api/user";
import Url from "../JS/url";
import User from "../Models/user";
import GoBack from "../Components/back";

const Register = (props) => {
    const [user, _setUser] = useState(new User());

    const setUser = (e) => {
        user.set(e.target.name, e.target.value);
        _setUser(user);
    };

    const onRegisterClick = async () => {
        if (!user.isValidForRegistration()) {
            return;
        }

        await registerUser(user.attributes);
        props.dispatch(push(Url.Login))
    };

    return (
        <div className="register-container">
            <div className="register">
                <GoBack url={Url.Home}/>
                <MyInput
                    type='text'
                    name='name'
                    placeholder='Name'
                    onChangeText={setUser}
                />
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
                    onClick={onRegisterClick}
                    label='Register'
                />
            </div>
        </div>
    );
};

export default connect()(Register);
