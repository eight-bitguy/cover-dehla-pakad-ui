import Echo from "laravel-echo";
import Pusher from "pusher-js";
import {store} from "../index";
import {updateAdditionalInfo, updateNextChance} from "../Redux/modules/additionalInfo";
import {updateAllStake} from "../Redux/modules/cards";
import {addRoom} from "../Redux/modules/room";
import Url from "./url";
import {replace} from "connected-react-router";
import {joinNewUsers} from "./helper";

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
        await this.dispatch(updateAdditionalInfo(e));
        await this.dispatch(updateAllStake(data));
    };

    handleStartRoomEvent = async (e) => {
        const room = e.data;
        await this.dispatch(addRoom(room));
        const url = Url.GamePage(room.code);
        this.dispatch(replace(url));
    };

    handleNewPlayerJoinEvent = async (e) => {
        await joinNewUsers(e.data);
    };
}
