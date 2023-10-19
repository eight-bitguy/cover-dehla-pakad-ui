import Echo from "laravel-echo";
import Pusher from "pusher-js";
import {store} from "../index";
import {updateOnNewGameEvent, updateFlashCard} from "../Redux/modules/additionalInfo";
import {updateRoomStatus} from "../Redux/modules/room";
import Url from "./url";
import {replace} from "connected-react-router";
import {joinNewUsers, sumObjectValues, sumObjectChar, fetchAndStoreInitialData, getStore} from "./helper";
import {batch} from "react-redux";
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
            .listen('BroadcastNewGameEvent', this.handleNewGameEvent)
            .listen('BroadcastTrumpOpenEvent', this.handleTrumpOpenEvent)

        this.channelId = channelId;
    }

    handleTrumpOpenEvent = async () => {
        await fetchAndStoreInitialData(this.dispatch);
    }

    handleNewGameEvent = async (e) => {
        const {cards:{hand}} = getStore();
        await batch(async () => {
            const shouldFlashCard = e.stakeWithUser.length === 0 
            && (sumObjectValues(e.score) + sumObjectChar(e.dehlaScore) > 0);
            
            if(shouldFlashCard) {
                this.dispatch(updateFlashCard(true));
                setTimeout(() => {
                    this.dispatch(updateOnNewGameEvent({...e, flashCard: false, hand}));
        
                }, 3000);
            }
            else {
                this.dispatch(updateOnNewGameEvent({...e, hand}));
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
