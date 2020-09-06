import React from 'react';
import MyButton from "../Components/myButton";
import {replace} from "connected-react-router";
import connect from 'react-redux/es/connect/connect';
import Url from "../JS/url";
import Cards from "../Components/cards";
import About from "../Components/about";

const HomePage = (props) => {

    const onLogin = () => {
        props.dispatch(replace(Url.Login));
    };

    const onRegister = () => {
        props.dispatch(replace(Url.Register));
    };

    const onClick = () => {};

    return (
        <div className='home-page'>
            <div className='options'>
                <Cards primaryType='display' onClickOnCard={onClick}/>
                <div className='text-div'>
                    <span className='line-1'>Welcome to</span>
                    <span className='line-2'>Dehla Pakad</span>
                    <span className='line-3'><span className='with-border'>cover</span></span>
                </div>
                <div className='button-div'>
                    <MyButton label='Login' onClick={onLogin}/>
                    <MyButton label='Register' onClick={onRegister}/>
                </div>
            </div>
            <About/>
        </div>
    );
};

export default connect()(HomePage);
