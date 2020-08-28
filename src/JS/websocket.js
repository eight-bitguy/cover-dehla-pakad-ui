import Echo from "laravel-echo";
import Pusher from "pusher-js";

export default class Websocket {

    echoClient;
    channelId = null;

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
    }

    async unSubscribe() {
        if (this.channelId) {
            await this.echoClient.leave(this.channelId);
        }
    }

    async addPrivateChannel(channelId, listeners) {
        await this.unSubscribe();

        Object.keys(listeners).forEach((event) => {
            this.echoClient.private(channelId).listen(event, listeners[event]);
        });

        this.channelId = channelId;
    }
}
