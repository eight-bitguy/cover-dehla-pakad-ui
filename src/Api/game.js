import Uri from "./uri";
import {get, post} from "./api";

export async function getInitialCards(roomCode) {
    return await get(Uri.initialCards(roomCode));
}

export async function play(roomCode, card) {
    return await post(Uri.play(roomCode), card);
}
