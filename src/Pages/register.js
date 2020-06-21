import React from 'react';
import connect from 'react-redux/es/connect/connect';
import Page from "./page";
import MyInput from "../Components/myInput";
import MyButton from "../Components/myButton";
import {register} from "../Api/user";
import {addUser} from "../Redux/modules/users";
import Url from "../url";

class Register extends Page {
    constructor(props) {
        super(props);
        this.state={
            name: '',
            email: '',
            password: ''
        };
    }

    onChangeText = (e) => {
        this.setState({[e.target.name]: e.target.value});
    };

    register = async () => {
        const {name, email, password} = this.state;
        const isValid = name && email && password;

        if (!isValid) {
            return;
        }
        const { data: userProfile } = await register(this.state);
        this.props.dispatch(addUser([userProfile]));
        this.props.history.push(Url.LandingPage);
    };

    render() {
        return (
            <div className="row mt-5">
                <div className="col-10 offset-1 col-md-4 offset-md-4">
                    <MyInput
                        type='text'
                        name='name'
                        className='mt-3'
                        placeholder='Name'
                        onChangeText={this.onChangeText}
                    />
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
                        onClick={this.register}
                        label='Register'
                        className='mt-5'
                    />
                </div>
            </div>
        );
    }
}

export default connect()(Register);
