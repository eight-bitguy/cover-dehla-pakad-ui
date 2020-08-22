import { mergeBasedOnAttribute } from "../../JS/helper";

const ADD_USER = 'ADD_USER';

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
