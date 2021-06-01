import React from 'react';
import { replace } from 'connected-react-router'
import connect from 'react-redux/es/connect/connect';
import Url from "../JS/url";
import Page from "./page";
import AppEventEmitter, {AppEvent} from "../JS/events";
import {addRoom} from "../Redux/modules/room";
import RoomUsers from "../Collections/roomUsers";
import Users from "../Collections/users";
import {joinRoom} from "../Api/room";
import {addAlreadyJoinedUsers} from "../JS/helper";

import GoBack from "../Components/back";
import Instructions from "../Components/instructions";
import RenderJoinedUser from "../Components/JoinedUserDisplay2";
import Footer from "../Components/joiningPageFooter";

class JoiningPage extends Page {
    roomCode;

    constructor(props) {
        super(props);
        this.roomCode = props.match.params.roomCode;
    }

    async componentDidMount() {
        const response = await joinRoom(this.roomCode);
        await addAlreadyJoinedUsers(this.roomCode);
        if (response && !!response.data) {
            this.props.dispatch(addRoom(response.data));
            await AppEventEmitter.emit(AppEvent.addPrivateChannel, this.roomCode);
            return;
        }
        this.props.dispatch(replace(Url.LandingPage));
    }

    render() {
        const {roomUsers} = this.props;
        const additionClass = roomUsers.length ? '' : '-loading';

        return (
            <div className='joining-page-container'>
                <div className='joining-page'>
                    <GoBack url={Url.LandingPage}/>
                    <div className='code-div'>
                        <span className='code'>Code</span>
                        <span className='code'>:</span>
                        <span className='code'>{this.roomCode}</span>
                    </div>
                    <div className={`users ${additionClass}`}>
                        <RenderJoinedUser/>
                    </div>
                    <Footer/>
                </div>
                <Instructions/>
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
