import React from 'react';
import {isAdmin} from "../JS/helper";
import MyButton from "./myButton";
import connect from 'react-redux/es/connect/connect';
import Room from "../Models/room";
import {startRoom} from "../Api/room";
import Url from "../JS/url";
import {replace} from "connected-react-router";

const Footer = (props) => {
    const {roomUsers, room} = props;

    const goToGame = () => {
        const url = Url.GamePage(room.get('code'));
        props.dispatch(replace(url));
    };

    const startThisRoom = async () => {
        await startRoom(room.get('code'));
    };

    if (roomUsers.length < 4) {
        return <span className='note'>Waiting for users to join</span>
    }

    if (!isAdmin() && !room.isActive()) {
        return <span className='note'>Ask admin to start the game</span>;
    }

    let onClick = startThisRoom;
    let buttonLabel = 'Start game';

    if (room.isActive()) {
        buttonLabel = 'Join';
        onClick = goToGame
    }

    return (
        <div className='start-button'>
            <MyButton
                label={buttonLabel}
                onClick={onClick}
                disabled={roomUsers.length !== 4}
            />
        </div>
    );
};

function mapStateToProps({roomUsers, room}) {
    return {
        roomUsers,
        room: new Room(room)
    };
}

export default connect(mapStateToProps)(Footer);
