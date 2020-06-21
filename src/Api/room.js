import {post, get} from "./api";
import Uri from "./uri";

export async function createRoom() {
    return await post(Uri.creatRoom);
}

export async function joinRoom(roomCode) {
    return await post(Uri.joinRoom(roomCode));
}

export async function startRoom(roomCode) {
    return await post(Uri.startRoom(roomCode));
}

export async function getJoinedUses(roomCode) {
    return await get(Uri.getJoinedUsers(roomCode));
}
