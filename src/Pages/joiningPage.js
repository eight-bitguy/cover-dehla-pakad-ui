import React from 'react';
import { replace } from 'connected-react-router'
import connect from 'react-redux/es/connect/connect';
import MyButton from "../Components/myButton";
import {getCurrentRoom} from "../JS/helper";
import Room from "../Models/room";
import Url from "../JS/url";
import Page from "./page";
import AppEventEmitter, {AppEvent} from "../JS/events";
import {addRoom} from "../Redux/modules/room";
import RoomUsers from "../Collections/roomUsers";
import Users from "../Collections/users";
import Loader from "../Components/loader";

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
        const currentRoom = getCurrentRoom();
        await this.startRoom(currentRoom.code);
    };

    render() {
        const {room} = this.state;
        const roomCode = room.get('code');
        const {roomUsers} = this.props;
        const additionClass = roomUsers.length ? '' : '-loading';

        return (
            <div className='joining-page-container'>
                <div className='joining-page'>
                    <div className='code'>
                        {`Room code : ${roomCode}`}
                    </div>
                    <div className={`users ${additionClass}`}>
                        {this.renderJoinedUser()}
                    </div>
                    <div className='start-button'>
                        <MyButton
                            label='Start game'
                            onClick={this.startRoom}
                            disabled={roomUsers.length !== 4}
                        />
                    </div>
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
