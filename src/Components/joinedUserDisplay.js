import React from 'react';
import connect from 'react-redux/es/connect/connect';
import Loader from "./loader";

const TeamDisplayContainer = ({className, roomUsers, index}) => {
    if (!roomUsers || roomUsers.length <= index) {
        return (
            <div className={`loader-container ${className}`}>
                <Loader/>
            </div>
        );
    }

    const user1Name = roomUsers.length > index ? roomUsers[index].name : '';
    const user2Name = roomUsers.length > (index + 1) ? roomUsers[index + 1].name : '';

    return (
        <div>
            {index===2 && <div className='center'><span className='center'>VS</span></div>}
            <div className={`team-display-container ${className}`}>
                <div className='user-row'>
                    <span>{user1Name}</span>
                </div>
                <div className='user-row'>
                    <span>{user2Name}</span>
                </div>
            </div>
        </div>
    );
};

const JoinedUserDisplay = (props) => {
    const {roomUsers} = props;

    return (
        <div className='joined-user-container'>
            <TeamDisplayContainer roomUsers={roomUsers} index={0} className='left'/>
            <TeamDisplayContainer roomUsers={roomUsers} index={2} className='right'/>
        </div>
    );

};

function mapStateToProps({roomUsers}) {
    return {
        roomUsers
    };
}

export default connect(mapStateToProps)(JoinedUserDisplay);
