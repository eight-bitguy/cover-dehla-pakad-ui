import React from 'react';
import LogoutIcon from "../IMAGES/logoutButton";

const LogoutHeader = () => {
    return (
        <div className='logout-header'>
            <div className='logout'>
                <LogoutIcon onClick={window.logout}/>
            </div>
        </div>
    );
};

export default LogoutHeader;
