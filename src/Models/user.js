import BaseModel from "./baseModel";

export default class User extends BaseModel {
    static get ROOM_USER_POSITION() {
        return 'a1';
    }
}
