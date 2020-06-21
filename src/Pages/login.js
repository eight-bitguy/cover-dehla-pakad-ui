import React from 'react';
import connect from 'react-redux/es/connect/connect';
import Page from "./page";
import MyInput from "../Components/myInput";
import MyButton from "../Components/myButton";
import {addUser} from "../Redux/modules/users";
import Url from "../url";
import { login } from "../Api/login";
import {updateLoggedInUserId} from "../Redux/modules/additionalInfo";
import {batch} from "react-redux";


class Login extends Page {
    constructor(props) {
        super(props);
        this.state={
            email: 'sj@jain.com',
            password: 'shanuJain',
            errors: []
        };
    }

    login = async () => {
        const { email, password} = this.state;
        const isValid = email && password;

        if (!isValid) {
            return;
        }

        const response = await login(this.state);

        if (!response.data) {
            this.setState({errors: response.errors});
            return;
        }

        const userProfile = response.data;
        await window.setToken(userProfile['token']);

        await batch(async () => {
            await this.props.dispatch(addUser([userProfile]));
            await this.props.dispatch(updateLoggedInUserId(userProfile.id));
        });
        this.props.history.push(Url.LandingPage);
    };

    render() {
        return (
            <div className="row mt-5">
            {this.state.error}
                <div className="col-md-4 col-10 offset-md-4 offset-1">
                    <div>{this.state.errors.length ? this.state.errors[0] : ''}</div>
                    <MyInput
                        type='text'
                        name='email'
                        className='mt-3'
                        placeholder='Email'
                        onChangeText={this.onChangeText}
                    />
                    <MyInput
                        type='password'
                        name='password'
                        className='mt-3'
                        placeholder='Password'
                        onChangeText={this.onChangeText}
                    />
                    <MyButton
                        type={MyButton.TYPE_BIG_ROUND_BUTTON}
                        onClick={this.login}
                        label='Login'
                        className='mt-5'/>
                </div>
            </div>
        );
    }
}

export default connect()(Login);
