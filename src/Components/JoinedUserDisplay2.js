import React from 'react';
import connect from 'react-redux/es/connect/connect';
import Loader from "./loader";

const RenderJoinedUser = (props) => {
    const {roomUsers} = props;
    const toIterate = [false, false, false, false];

    if (!roomUsers.length) {
        return (
            <div className='loader-container'>
                <Loader/>
            </div>
        );
    }

    return toIterate.map((roomUser, index) => {
        const present = roomUsers.length > index;
        const name = present ? roomUsers[index].name : '';
        const team = present ? roomUsers[index].position[0].toUpperCase() : '';
        return (
            <div key={`joiningPage-renderJoinedUser-${index}`} className='user-row'>
                <span>{name}</span>
                <span>{team}</span>
            </div>
        );
    });
};

function mapStateToProps({roomUsers}) {
    return {
        roomUsers
    };
}

export default connect(mapStateToProps)(RenderJoinedUser);
