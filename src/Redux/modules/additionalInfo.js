import update from 'immutability-helper';
import {FALSH_CARD, PLAY_CARD, UPDATE_LOGGED_IN_USER_ID, UPDATE_NEW_GAME_EVENT} from './../events';

export function updateLoggedInUserId(userId) {
    return {
        type: UPDATE_LOGGED_IN_USER_ID,
        data: userId
    };
}

export function updateOnNewGameEvent(event) {
    return {
        type: UPDATE_NEW_GAME_EVENT,
        ...event
    };
}

export function updateFlashCard(data) {
    return {
        type: FALSH_CARD,
        flashCard: data,
    };
}



const initialState = {
    loggedInUserId: null,
    nextChance: null,
    dehlaOnStake: 0,
    score: {a1: 0, a2: 0, b1: 0, b2: 0},
    dehlaScore: {a1: '', a2: '', b1: '', b2: ''},
    trumpHiddenBy: 'a1',
    trump: null,
    trumpDecidedBy: null,
    roomStatus: null,
    flashCard: false
};

export default function additionalInfo(state = initialState, action) {
    switch (action.type) {
        case UPDATE_LOGGED_IN_USER_ID:
            return update(state, {loggedInUserId: {$set: action.data}});

        case FALSH_CARD:
            return update(state, {flashCard: {$set: action.flashCard}});

        case PLAY_CARD:
            return update(state, {nextChance: {$set: action.nextChance}});

        case UPDATE_NEW_GAME_EVENT:
            return update(state, {
                nextChance: { $set: action.nextChance },
                score: { $set: action.score },
                dehlaScore: { $set: action.dehlaScore },
                trumpHiddenBy: { $set: action.trumpHiddenBy },
                trump: { $set: action.trump },
                trumpDecidedBy: { $set: action.trumpDecidedBy },
                roomStatus: { $set: action.roomStatus },
                flashCard: { $set: action.flashCard }
            });

        default:
            return state;
    }
}
