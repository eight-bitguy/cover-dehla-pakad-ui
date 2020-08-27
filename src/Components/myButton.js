import React from 'react';
import Loader from "./loader";

const MyButton = (props) => {
    return (
        <div className={`my-button-container ${props.disabled ? '-disabled' : ''}`}>
        <button
            onClick={props.onClick}
            disabled={props.disabled}
            className={`my-button ${props.className ?? ''}`}>
            <div className='button-loader-container'>{props.loading ? <Loader /> : props.label}</div>
        </button>
        </div>
    );
};

export default MyButton;
