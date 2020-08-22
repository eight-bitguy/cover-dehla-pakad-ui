import React from 'react';

const MyInput = (props) => {
    return (
        <div className='my-input-container'>
            <div className='label'>
                {props.placeholder}
            </div>
            <input
                type={props.type}
                id={props.id}
                name={props.name}
                onChange={props.onChangeText}
                className={`input ${props.className ?? ''}`}
            />
        </div>
    );
};

export default MyInput;
