import { EventEmitter } from 'fbemitter';

export const AppEvent = {
    addPrivateChannel: 'addPrivateChannel'
};

const emitter = new EventEmitter();

export default emitter;
