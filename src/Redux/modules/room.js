import update from 'immutability-helper';

const ADD_ROOM = 'ADD_ROOM';
const UPDATE_STATUS = 'UPDATE_STATUS';

export function addRoom(data) {
    return {
        type: ADD_ROOM,
        data: data
    };
}

export function updateRoomStatus(status) {
    return {
        type: UPDATE_STATUS,
        data: status
    };

}

const initialState = {} ;

export default function room(state = initialState, action) {
    switch (action.type) {
        case ADD_ROOM:
            return action.data;

        case UPDATE_STATUS:
            return update(state, {status: {$set: action.status}});

        default:
            return state;
    }
}
