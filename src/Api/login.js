import Uri from "./uri";
import {post} from "./api";

export async function login(credential) {
    return await post(Uri.login, credential);
}

export async function guestLogin(name) {
    return await post(Uri.guestLogin, {name});
}
