import update from 'immutability-helper';

const ADD_ROOM = 'ADD_ROOM';

export function addRoom(data) {
    return {
        type: ADD_ROOM,
        data: data
    };
}

const initialState = {} ;

export default function room(state = initialState, action) {
    switch (action.type) {
        case ADD_ROOM:
            return action.data;

        default:
            return state;
    }
}
