import React from 'react';
import LogoutIcon from "../Icons/logoutButton";

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
