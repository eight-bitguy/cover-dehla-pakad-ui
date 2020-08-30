import React from 'react';
import { replace } from 'connected-react-router'
import connect from 'react-redux/es/connect/connect';
import MyButton from "../Components/myButton";
import Room from "../Models/room";
import Url from "../JS/url";
import Page from "./page";
import AppEventEmitter, {AppEvent} from "../JS/events";
import {addRoom} from "../Redux/modules/room";
import RoomUsers from "../Collections/roomUsers";
import Users from "../Collections/users";
import Loader from "../Components/loader";
import {startRoom} from "../Api/room";
import {isAdmin} from "../JS/helper";

import GoBack from "../Components/back";

class JoiningPage extends Page {

    constructor(props) {
        super(props);
        this.state = {
            room: new Room({code: props.match.params.roomCode})
        }
    }

    async componentDidMount() {
        const {room} = this.state;
        const canJoin = await room.joinRoom();
        if (!canJoin) {
            this.props.dispatch(replace(Url.LandingPage))
        }
        this.props.dispatch(addRoom(room.attributes));
        await AppEventEmitter.emit(AppEvent.addPrivateChannel, room.get('code'));
        this.setState({room});
    }

    renderJoinedUser = () => {
        const {roomUsers} = this.props;
        const toIterate = [false, false, false, false];

        if (!roomUsers.length) {
            return (<div className='loader-container'><Loader/></div>);
        }

        return toIterate.map((roomUser, index) => {
            const present = roomUsers.length > index;
            const name = present ? roomUsers.at(index).get('name') : '';
            const team = present ? roomUsers.at(index).get('position')[0].toUpperCase() : '';
            return (
                <div key={`joiningPage-renderJoinedUser-${index}`} className='user-row'>
                    <span>{name}</span>
                    <span>{team}</span>
                </div>
            );
        });
    };

    startRoom = async () => {
        const {room} = this.state;
        await startRoom(room.get('code'));
    };

    goToGame = () => {
        const {room} = this.state;
        const url = Url.GamePage(room.get('code'));
        this.props.dispatch(replace(url));
    };

    renderFooter = () => {
        const {roomUsers} = this.props;
        const {room} = this.state;

        if (roomUsers.length < 4) {
            return <span className='note'>Waiting for users to join</span>
        }

        if (!isAdmin() && !room.isActive()) {
            return <span className='note'>Ask admin to start the game</span>;
        }

        let onClick = this.startRoom;
        let buttonLabel = 'Start game';

        if (room.isActive()) {
            buttonLabel = 'Join';
            onClick = this.goToGame
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

    render() {
        const {room} = this.state;
        const roomCode = room.get('code');
        const {roomUsers} = this.props;
        const additionClass = roomUsers.length ? '' : '-loading';

        return (
            <div className='joining-page-container'>
                <div className='joining-page'>
                    <GoBack url={Url.LandingPage}/>
                    <div className='code-div'>
                        <span className='code'>Code</span>
                        <span className='code'>:</span>
                        <span className='code'>{roomCode}</span>
                    </div>
                    <div className={`users ${additionClass}`}>
                        {this.renderJoinedUser()}
                    </div>
                    {this.renderFooter()}
                </div>
            </div>
        );
    }
}

function mapStateToProps({roomUsers, users}) {
    return {
        roomUsers: new RoomUsers(roomUsers),
        users: new Users(users)
    };
}

export default connect(mapStateToProps)(JoiningPage);
