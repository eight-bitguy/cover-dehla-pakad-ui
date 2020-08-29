import React from 'react';
import BackIcon from "../IMAGES/backIcon";
import { replace } from 'connected-react-router'
import connect from 'react-redux/es/connect/connect';

const GoBack = (props) => {

    const goToUrl = () => {
        props.dispatch(replace(props.url));
    };

    return (
        <div className='go-back-container'>
            <div className='go-back'>
                <BackIcon onClick={goToUrl}/>
            </div>
        </div>
    );
};

export default connect()(GoBack);
