import BaseModel from "./baseModel";
import {createRoom, joinRoom} from "../Api/room";

export default class Room extends BaseModel {

    static STATUS_ACTIVE = 'active';
    static STATUS_INACTIVE = 'inactive';
    static POSITION_A1 = 'a1';
    static POSITION_B1 = 'b1';
    static POSITION_A2 = 'a2';
    static POSITION_B2 = 'b2';

    static ALL_POSITIONS = [
        Room.POSITION_A1,
        Room.POSITION_B1,
        Room.POSITION_A2,
        Room.POSITION_B2
    ];

    async createNewRoom() {
        const { data : newRoom } = await createRoom();
        this.set(newRoom);
    }

    async joinRoom() {
        const response = await joinRoom(this.get('code'));

        if (response && !!response.data) {
            this.set(response.data);
            return true;
        }
        return false;
    }

    isActive() {
        return this.get('status') === Room.STATUS_ACTIVE;
    }

}
