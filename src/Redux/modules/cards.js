import update from 'immutability-helper';

const ADD_CARDS_IN_HAND = 'ADD_CARDS_IN_HAND';
const UPDATE_CARDS_IN_STAKE = 'UPDATE_CARDS_IN_STAKE';
const UPDATE_CARDS_IN_OLD_STAKE = 'UPDATE_CARDS_IN_OLD_STAKE';

export function addCardsInHand(data) {
    return {
        type: ADD_CARDS_IN_HAND,
        data: data
    };
}

export function updateStake(data) {
    return {
        type: UPDATE_CARDS_IN_STAKE,
        data: data
    };
}

export function updateOldStake(data) {
    return {
        type: UPDATE_CARDS_IN_OLD_STAKE,
        data: data
    };
}

const initialState = {
    hand: [],
    stake: [],
    oldStake:[]
};

export default function rooms(state = initialState, action) {
    switch (action.type) {
        case ADD_CARDS_IN_HAND:
            return update(state, { hand: { $set: action.data } } );

        case UPDATE_CARDS_IN_STAKE:
            return update(state, { stake: { $set: action.data } } );

        case UPDATE_CARDS_IN_OLD_STAKE:
            return update(state, { oldStake: { $set: action.data } } );

        default:
            return state;
    }
}
