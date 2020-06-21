import {mergeBasedOnAttribute} from "../../helper";

const ADD_ROOM = 'ADD_ROOM';

export function addRoom(data) {
    return {
        type: ADD_ROOM,
        data: data
    };
}

const initialState = [] ;

export default function rooms(state = initialState, action) {
    switch (action.type) {
        case ADD_ROOM:
            return mergeBasedOnAttribute(state, [action.data], 'code');

        default:
            return state;
    }
}
