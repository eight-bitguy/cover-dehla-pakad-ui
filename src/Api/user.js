import Uri from "./uri";
import {post, get} from "./api";

export async function registerUser(data) {
    return await post(Uri.register, data);
}

export async function getMe() {
    return await get(Uri.getMe);
}
