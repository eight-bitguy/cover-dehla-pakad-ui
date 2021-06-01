import BaseModel from "./baseModel";

export default class User extends BaseModel {
    static get ROOM_USER_POSITION() {
        return 'a1';
    }

    isValidForRegistration() {
        return !!(this.get('name') && this.get('email') && this.get('password'));
    }

    isValidForLogin() {
        return !!(this.get('email') && this.get('password'));
    }

    isValidForGuestLogin() {
        return !!(this.get('email'));
    }
}
