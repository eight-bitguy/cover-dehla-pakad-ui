import Uri from "./uri";
import {post} from "./api";

export async function login(credential) {
    return await post(Uri.login, credential);
}
