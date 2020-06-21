import React from 'react';
import Page from './page';
import MyInput from "../Components/myInput";
import MyButton from "../Components/myButton";
import Ruler from "../Components/ruler";
import {createRoom} from "../Api/room";
import connect from 'react-redux/es/connect/connect';
import {addRoom} from "../Redux/modules/rooms";
import Url from "../url";
import {joinRoomWithRoomCode} from "../helper";
import AppEventEmitter, {AppEvent} from "../events";

class LandingPage extends Page {

    constructor(props) {
        super(props);
        this.state = {
            joiningRoomCode: '140890'
        };
    }

    joinAndMoveToJoiningPage = async (roomCode) => {
        await joinRoomWithRoomCode(roomCode);
        await AppEventEmitter.emit(AppEvent.addPrivateChannel, roomCode);
        this.props.history.push(Url.JoiningGame(roomCode));
    };

    createRoom = async () => {
        const { data : newRoom } = await createRoom();
        this.props.dispatch(addRoom(newRoom));
        this.joinAndMoveToJoiningPage(newRoom['code']);
    };

    joinRoom = async () => {
        const { joiningRoomCode } = this.state;

        if (joiningRoomCode) {
            this.joinAndMoveToJoiningPage(joiningRoomCode);
        }
    };

    renderJoinRoom = () => {
        return (
            <div className='row'>
                <div className='col-md-2 offset-md-4 col-5 offset-1 mt-5'>
                    <MyInput
                        className='join-room'
                        name='joiningRoomCode'
                        type='text'
                        onChangeText={this.onChangeText}/>
                </div>
                <div className='col-md-2 col-5 mt-5'>
                    <MyButton
                        type={MyButton.TYPE_BIG_ROUND_BUTTON}
                        label='Join Room'
                        onClick={this.joinRoom} />
                </div>
            </div>
        );
    };

    renderCreateRoom = () => {
        return (
            <div className='row'>
                <div className='col-md-2 offset-md-5 col-8 offset-2'>
                    <MyButton
                        type={MyButton.TYPE_BIG_ROUND_BUTTON}
                        label='Create a new Room'
                        onClick={this.createRoom}/>
                </div>
            </div>
        );
    };

    render() {
        return(
            <>
                {this.renderJoinRoom()}
                <Ruler />
                {this.renderCreateRoom()}
            </>
        );
    }
}

export default connect()(LandingPage)
