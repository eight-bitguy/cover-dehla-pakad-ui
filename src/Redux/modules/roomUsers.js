import { ADD_USERS_IN_ROOM } from '../events';

export function addUsersInRoom(data) {
    return {
        type: ADD_USERS_IN_ROOM,
        data
    };
}
const initialState = [];

export default function roomUsers(state = initialState, action) {
    switch (action.type) {
        case ADD_USERS_IN_ROOM:
            return action.data;

        default:
            return state;
    }
}
