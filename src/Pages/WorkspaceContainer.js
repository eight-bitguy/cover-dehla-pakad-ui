import React from 'react';
import Page from "./page";
import {Switch, Route} from "react-router-dom";
import Url from "../JS/url";
import AppEventEmitter, { AppEvent } from '../JS/events';
import connect from 'react-redux/es/connect/connect';
import {updateLoggedInUserId} from "../Redux/modules/additionalInfo";
import {addAlreadyJoinedUsers, joinRoomWithRoomCode} from "../JS/helper";
import {getMe} from "../Api/user";
import {addUser} from "../Redux/modules/users";
import PageLoadable from "../Components/loadable";
import WebSocket from "../JS/websocket";
import {batch} from "react-redux";
import Stats from "../Components/stats";

const GameOverPage = PageLoadable({ loader: () => import("../Pages/gameOverPage") });
const GamePage = PageLoadable({ loader: () => import('./gamePage') });
const JoiningPage = PageLoadable({loader: () => import('./joiningPage')});
const LandingPage = PageLoadable({loader: () => import('./landingPage')});

class WorkspaceContainer extends Page {

    webSocket;

    fetchRoomDetails = async (roomCode) => {
        if (!roomCode) {
            return;
        }
        if (!await joinRoomWithRoomCode(roomCode)) {
            return;
        }
        await this.addPrivateChannel(roomCode);
        await addAlreadyJoinedUsers(roomCode);
    };

    async componentDidMount() {
        this.webSocket = new WebSocket();
        const response = await getMe();

        if (response && response.data) {
            await batch(async () => {
                this.props.dispatch(addUser([response.data]));
                this.props.dispatch(updateLoggedInUserId(response.data.id));
            });
        }

        AppEventEmitter.addListener(AppEvent.addPrivateChannel, this.addPrivateChannel);
        await this.fetchRoomDetails(window.getRoomCode());
    }

    async componentWillUnmount() {
        await this.webSocket.unSubscribe();
    }

    addPrivateChannel = async (roomCode) => {
        const channelId = `App.room.${roomCode}`;
        await this.webSocket.addPrivateChannel(channelId);
    };

    render() {
        return (
            <Switch>
                <Route exact path={Url.Stats} component={Stats}/>
                <Route exact path={Url.GamePage()} component={GamePage} />
                <Route exact path={Url.LandingPage} component={LandingPage} />
                <Route path={Url.JoiningGame()} component={JoiningPage} />
                <Route exact path={Url.GameOver()} component={GameOverPage}/>
            </Switch>
        );
    }
}

export default connect()(WorkspaceContainer);
