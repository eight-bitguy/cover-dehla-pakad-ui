import React from 'react';
import Page from "./page";
import Pusher from "pusher-js";
import Echo from "laravel-echo";
import {Switch, Route} from "react-router-dom";
import Url from "../JS/url";
import LandingPage from "./landingPage";
import AppEventEmitter, { AppEvent } from '../JS/events';
import GamePage from "./gamePage";
import JoiningPage from "./joiningPage";
import connect from 'react-redux/es/connect/connect';
import {addRoom} from "../Redux/modules/room";
import {updateNextChance} from "../Redux/modules/additionalInfo";
import {updateOldStake, updateStake} from "../Redux/modules/cards";
import {addAlreadyJoinedUsers, joinNewUsers, joinRoomWithRoomCode} from "../JS/helper";
import {batch} from "react-redux";


class WorkspaceContainer extends Page {
    constructor(props) {
        super(props);

        this.state = {
            pusherSubscribedToRoom: null
        };

        window.pusher = Pusher;
        this.initializeWebsocket();
        AppEventEmitter.addListener(AppEvent.addPrivateChannel, this.addPrivateChannel);
    }

    static echoClient;

    //ToDo Externalise env variables
    initializeWebsocket = () => {
        WorkspaceContainer.echoClient = new Echo({
            broadcaster: 'pusher',
            cluster: 'ap2',
            authEndpoint: `${window.apiUrl()}/api/broadcasting/auth`,
            key: '55d05ff09859c119f84f',
            activityTimeout: 60000,
            auth: {
                headers: {
                    Authorization: 'Bearer ' + window.getToken(),
                }
            },
            forceTLS: true
        });
    };

    fetchRoomDetails = async (roomCode) => {
        if (!await joinRoomWithRoomCode(roomCode)) {
            return;
        }
        await this.addPrivateChannel(roomCode);
        await addAlreadyJoinedUsers(roomCode);
        // window.logout();
        // this.props.history.push(Url.Login);
    };

    async componentDidMount() {
        // await this.fetchRoomDetails(roomCode);
    }

    handleNewPlayerJoinEvent = async (e) => {
        console.log('handleNewPlayerJoinEvent', e);
        await joinNewUsers(e.data);
    };

    handleStartRoomEvent = async (e) => {
        console.log('handleNewGameEvent', e);
        const room = e.data;
        await this.props.dispatch(addRoom(room));
        this.props.history.push(Url.GamePage);
    };

    handleNewGameEvent = async (e) => {
        console.log('handleNewGameEvent', e);
        await batch(async () => {
            await this.props.dispatch(updateNextChance(e.nextChance));
            await this.props.dispatch(updateOldStake(e.oldStake));
            await this.props.dispatch(updateStake(e.stake));
        });
    };

    addPrivateChannel = async (roomCode) => {
        const { pusherSubscribedToRoom } = this.state;
        const channelId = `App.room.${roomCode}`;

        if (pusherSubscribedToRoom && (pusherSubscribedToRoom === roomCode)) {
            return;
        }
        await WorkspaceContainer.echoClient.private(channelId)
            .listen('BroadcastNewPlayerJoinEvent', this.handleNewPlayerJoinEvent)
            .listen('BroadcastRoomStartEvent', this.handleStartRoomEvent)
            .listen('BroadcastNewGameEvent', this.handleNewGameEvent);
        await this.setState({ pusherSubscribedToRoom: roomCode });
    };

    render() {
        return (
            <Switch>
                <Route path={Url.GamePage} component={GamePage} />
                <Route path={Url.LandingPage} component={LandingPage} />
                <Route path={Url.JoiningGame()} component={JoiningPage} />
            </Switch>
        );
    }
}

export default connect()(WorkspaceContainer);
