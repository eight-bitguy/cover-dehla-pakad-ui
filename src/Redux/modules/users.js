import { mergeBasedOnAttribute } from "../../JS/helper";
import { ADD_USER } from "../events";

export function addUser(data) {
    return {
        type: ADD_USER,
        data
    };
}

const initialState = [];

export default function users(state = initialState, action) {
    switch (action.type) {
        case ADD_USER:
            return mergeBasedOnAttribute(state, action.data, 'id');

        default:
            return state;
    }
}
