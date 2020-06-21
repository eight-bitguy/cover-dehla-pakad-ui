import React from 'react';
import Page from "./page";
import connect from 'react-redux/es/connect/connect';
import MyButton from "../Components/myButton";
import {startRoom} from "../Api/room";
import {store} from './../index';

import {
    getCurrentRoom,
    getCurrentRoomUsers,
    getUsersWithPosition,
    isUserCurrentRoomAdmin
} from "../helper";


class JoiningPage extends Page {
    constructor(props) {
        super(props);
        this.state = {
            roomCode : props.match.params.roomCode
        };
    }

    renderJoinedUser = (user, index) => {
        const roomUser = user.roomUser;
        return (
            <div key={`joiningPage-renderJoinedUser-${index}`}>
                {`${user.name} - ${roomUser.position}`}
            </div>
        );
    };

    startRoom = async () => {
        const currentRoom = getCurrentRoom();
        await startRoom(currentRoom.code);
    };

    renderStartOrJoinButton = () => {
        const roomUsers = getCurrentRoomUsers();

        if (!(isUserCurrentRoomAdmin() && roomUsers && roomUsers.length === 4)) {
            return <div />;
        }

        return (
            <div className='row mt-5'>
                <div className='col-md-4 offset-md-4 col-8 offset-2'>
                    <MyButton
                        type={MyButton.TYPE_SMALL_ROUND_BUTTON}
                        label='Start game'
                        onClick={this.startRoom}
                    />
                </div>
            </div>
        );
    };

    renderAllJoinedUser = () => {
        const users = getCurrentRoomUsers();
        const usersWithPosition = getUsersWithPosition(users, this.state.roomCode);

        if (!users) {
            return <div/>;
        }

        return (
            <div className='row'>
                <div className='col-md-4 offset-md-4 col-8 offset-2'>
                    <div>User Joined</div>
                    {usersWithPosition.map(this.renderJoinedUser)}
                </div>
            </div>
        );
    };

    renderRoomInfo = () => {
        const room = getCurrentRoom();

        if (!room) {
            return;
        }

        return (
            <div className='row'>
                <div className='col-md-4 offset-md-4 col-8 offset-2'>
                    {`Room code : ${room.code}`}
                </div>
            </div>
        );
    };

    render() {
        return (
            <div className='mt-5'>
                {this.renderRoomInfo()}
                {this.renderAllJoinedUser()}
                {this.renderStartOrJoinButton()}
            </div>
        );
    }
}

function mapStateToProps({roomUsers, rooms}) {
    return {
        roomUsers,
        rooms
    };
}

export default connect(mapStateToProps)(JoiningPage);
