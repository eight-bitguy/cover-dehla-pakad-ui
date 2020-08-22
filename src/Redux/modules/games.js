import {mergeBasedOnAttribute} from "../../JS/helper";

const ADD_GAME = 'ADD_GAME';

export function addGame(data) {
    return {
        type: ADD_GAME,
        data: data
    };
}

const initialState = [] ;

export default function games(state = initialState, action) {
    switch (action.type) {
        case ADD_GAME:
            return mergeBasedOnAttribute(state, [action.data], 'id');

        default:
            return state;
    }
}
