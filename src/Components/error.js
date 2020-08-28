import React from 'react';

const Error = (props) => {
    return (
        <div className='error-container'>
            <div className='error'>
                {props.error}
            </div>
        </div>
    );
};

export default Error;
