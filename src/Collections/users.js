import BaseCollection from "./baseCollection";
import _ from 'underscore';
import User from "../Models/user";

export default class Users extends BaseCollection {
    model = function(attributes, options) {
        return new User(attributes, _.extend(options, { parse: true }));
    };

    getAllRoomUsers = () => {
        this.models.map(user => user.get('room_users').data);
    };
}
