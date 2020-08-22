import React from 'react';
import Loader from "./loader";

const MyButton = (props) => {
    const className = `my-button ${props.className ?? ''} ${props.disabled ? '-disabled' : ''}`;
    return (
        <button
            onClick={props.onClick}
            disabled={props.disabled}
            className={className}>
            <div className='button-loader-container'>{props.loading ? <Loader /> : props.label}</div>
        </button>
    );
};

export default MyButton;
