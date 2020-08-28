import React from 'react';
import Page from "./page";
import {Switch, Route} from "react-router-dom";
import Url from "../JS/url";
import AppEventEmitter, { AppEvent } from '../JS/events';
import connect from 'react-redux/es/connect/connect';
import {addRoom} from "../Redux/modules/room";
import {updateLoggedInUserId, updateNextChance} from "../Redux/modules/additionalInfo";
import {updateOldStake, updateStake} from "../Redux/modules/cards";
import {addAlreadyJoinedUsers, joinNewUsers, joinRoomWithRoomCode} from "../JS/helper";
import {batch} from "react-redux";
import {getMe} from "../Api/user";
import {addUser} from "../Redux/modules/users";
import PageLoadable from "../Components/loadable";
import WebSocket from "../JS/websocket";

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
        // window.logout();
        // this.props.history.push(Url.Login);
    };

    async componentDidMount() {
        this.webSocket = new WebSocket();
        const response = await getMe();

        if (response && response.data) {
            this.props.dispatch(addUser([response.data]));
            this.props.dispatch(updateLoggedInUserId(response.data.id));
        }

        AppEventEmitter.addListener(AppEvent.addPrivateChannel, this.addPrivateChannel);
        await this.fetchRoomDetails(window.getRoomCode());
    }

    async componentWillUnmount() {
        await this.webSocket.unSubscribe();
    }

    handleNewPlayerJoinEvent = async (e) => {
        await joinNewUsers(e.data);
    };

    handleStartRoomEvent = async (e) => {
        const room = e.data;
        await this.props.dispatch(addRoom(room));
        this.props.history.push(Url.GamePage(room.code));
    };

    handleNewGameEvent = async (e) => {
        await batch(async () => {
            await this.props.dispatch(updateNextChance(e.nextChance));
            await this.props.dispatch(updateOldStake(e.oldStake));
            await this.props.dispatch(updateStake(e.stake));
        });
    };

    addPrivateChannel = async (roomCode) => {
        const channelId = `App.room.${roomCode}`;

        const listeners = {
            BroadcastNewPlayerJoinEvent: this.handleNewPlayerJoinEvent,
            BroadcastRoomStartEvent: this.handleStartRoomEvent,
            BroadcastNewGameEvent: this.handleNewGameEvent,
        };
        await this.webSocket.addPrivateChannel(channelId, listeners);
    };

    render() {
        return (
            <Switch>
                <Route exact path={Url.GamePage()} component={GamePage} />
                <Route exact path={Url.LandingPage} component={LandingPage} />
                <Route path={Url.JoiningGame()} component={JoiningPage} />
            </Switch>
        );
    }
}

export default connect()(WorkspaceContainer);
