import update from 'immutability-helper';

const UPDATE_LOGGED_IN_USER_ID = 'UPDATE_LOGGED_IN_USER_ID';
const UPDATE_NEXT_CHANCE = 'UPDATE_NEXT_CHANCE';

export function updateLoggedInUserId(userId) {
    return {
        type: UPDATE_LOGGED_IN_USER_ID,
        data: userId
    };
}

export function updateNextChance(nextChance) {
    return {
        type: UPDATE_NEXT_CHANCE,
        data: nextChance
    };
}

const initialState = {
    loggedInUserId: null,
    nextChance: null,
};

export default function additionalInfo(state = initialState, action) {
    switch (action.type) {
        case UPDATE_LOGGED_IN_USER_ID:
            return update(state, {loggedInUserId: {$set: action.data}});

        case UPDATE_NEXT_CHANCE:
            return update(state, {nextChance: {$set: action.data}});

        default:
            return state;
    }
}
