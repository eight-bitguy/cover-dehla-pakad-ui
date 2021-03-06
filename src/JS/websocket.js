import Echo from "laravel-echo";
import Pusher from "pusher-js";
import {store} from "../index";
import {updateAdditionalInfo} from "../Redux/modules/additionalInfo";
import {updateAllStake} from "../Redux/modules/cards";
import {updateRoomStatus} from "../Redux/modules/room";
import Url from "./url";
import {replace} from "connected-react-router";
import {joinNewUsers} from "./helper";
import {batch} from "react-redux";
import {updateFlashCard} from "../Redux/modules/uiParams";
import Room from "../Models/room";

export default class Websocket {

    echoClient;
    channelId = null;
    dispatch;

    //ToDo Externalise env variables
    constructor() {
        window.pusher = Pusher;
        this.echoClient = new Echo({
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

        this.dispatch = store.dispatch;
    }

    async unSubscribe() {
        if (this.channelId) {
            await this.echoClient.leave(this.channelId);
        }
    }

    async addPrivateChannel(channelId) {
        if (this.channelId === channelId) {
            return;
        }

        this.echoClient.private(channelId)
            .listen('BroadcastNewPlayerJoinEvent', this.handleNewPlayerJoinEvent)
            .listen('BroadcastRoomStartEvent', this.handleStartRoomEvent)
            .listen('BroadcastNewGameEvent', this.handleNewGameEvent);

        this.channelId = channelId;
    }

    handleNewGameEvent = async (e) => {
        const data = {
            stake: e.stake,
            oldStake:e.oldStake
        };
        await batch(async () => {
            this.dispatch(updateAdditionalInfo(e));
            this.dispatch(updateAllStake(data));
            if (data.oldStake && data.oldStake.length===4) {
                this.dispatch(updateFlashCard(true));
            }
        });
    };

    handleStartRoomEvent = async (e) => {
        await this.dispatch(updateRoomStatus(Room.STATUS_ACTIVE));
        await joinNewUsers(e.data);

        const url = Url.GamePage(window.getRoomCode());
        this.dispatch(replace(url));
    };

    handleNewPlayerJoinEvent = async (e) => {
        await joinNewUsers(e.data);
    };
}
