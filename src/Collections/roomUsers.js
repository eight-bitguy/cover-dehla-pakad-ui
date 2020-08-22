import BaseCollection from "./baseCollection";
import _ from 'underscore';
import RoomUser from "../Models/roomUser";

export default class RoomUsers extends BaseCollection {

    model = (attributes, options) => {
        return new RoomUser(attributes, _.extend(options, { parse: true }));
    };

    parse = (response) => {
        if (response.data) {
            return response.data;
        }
        return response;
    };

}
