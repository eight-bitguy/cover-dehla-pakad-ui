import React from 'react';
import MyButton from "../Components/myButton";
import {replace} from "connected-react-router";
import connect from 'react-redux/es/connect/connect';
import Url from "../JS/url";

const HomePage = (props) => {

    const onLogin = () => {
        props.dispatch(replace(Url.Login));
    };

    const onRegister = () => {
        props.dispatch(replace(Url.Register));
    };

    return (
        <div className='home-page'>
            <span className='line-1'>Welcome to</span>
            <span className='line-2'>Cover Dehla Pakad</span>
            <div className='button-div'>
                <MyButton label='Login' onClick={onLogin}/>
                <MyButton label='Register' onClick={onRegister}/>
            </div>
        </div>
    );
};

export default connect()(HomePage);
