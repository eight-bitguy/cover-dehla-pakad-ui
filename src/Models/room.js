import BaseModel from "./baseModel";
import {createRoom, joinRoom} from "../Api/room";

export default class Room extends BaseModel {

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

}
