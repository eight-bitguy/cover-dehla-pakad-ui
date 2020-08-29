import update from 'immutability-helper';

const UPDATE_LOGGED_IN_USER_ID = 'UPDATE_LOGGED_IN_USER_ID';
const UPDATE_NEXT_CHANCE = 'UPDATE_NEXT_CHANCE';
const UPDATE_ADDITIONAL_INFO = 'UPDATE_ADDITIONAL_INFO';

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

export function updateAdditionalInfo(nextChance) {
    return {
        type: UPDATE_ADDITIONAL_INFO,
        data: nextChance
    };
}

const initialState = {
    loggedInUserId: null,
    nextChance: null,
    claiming_by: null,
    dehlaOnStake: 0,
    score: {a1: 0, a2: 0, b1: 0, b2: 2},
    trump: null,
    trumpDecidedBy: null,
    trumpFromNextIteration: null,
};

export default function additionalInfo(state = initialState, action) {
    switch (action.type) {
        case UPDATE_LOGGED_IN_USER_ID:
            return update(state, {loggedInUserId: {$set: action.data}});

        case UPDATE_NEXT_CHANCE:
            return update(state, {nextChance: {$set: action.data}});

        case UPDATE_ADDITIONAL_INFO:
            return update(state, {$merge: action.data});

        default:
            return state;
    }
}
