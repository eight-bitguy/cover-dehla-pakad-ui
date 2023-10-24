import Echo from "laravel-echo";
import Pusher from "pusher-js";
import {store} from "../index";
import {updateOnNewGameEvent, flashCard} from "../Redux/modules/additionalInfo";
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
            key: window.PRODUCTION_WEBSOCKET_KEY,
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
            
            const shouldFlashCard = (
                e.stakeWithUser.length === 4 
                && (sumObjectValues(e.score) + sumObjectChar(e.dehlaScore) > 0)
            );

            if(!shouldFlashCard) {
                this.dispatch(updateOnNewGameEvent({...e, hand}));
                return;
            }

            this.dispatch(flashCard({nextChance:e.nextChance, stakeWithUser: e.stakeWithUser}));
            setTimeout(() => {
                const toUpdate = {...e, flashCard: false, hand, stakeWithUser: []};
                this.dispatch(updateOnNewGameEvent(toUpdate));
                if (e.roomStatus === Room.STATUS_INACTIVE) {
                    this.dispatch(replace(Url.GameOver(window.getRoomCode())));
                }
    
            }, 3000);

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
