import update from 'immutability-helper';

const ADD_CARDS_IN_HAND = 'ADD_CARDS_IN_HAND';
const UPDATE_CARDS_IN_STAKE = 'UPDATE_CARDS_IN_STAKE';
const UPDATE_CARDS_IN_OLD_STAKE = 'UPDATE_CARDS_IN_OLD_STAKE';
const UPDATE_ALL_CARDS_IN_STAKE = 'UPDATE_ALL_CARDS_IN_STAKE';
const UPDATE_ALL_CARDS = 'UPDATE_ALL_CARDS';

export function addCardsInHand(data) {
    return {
        type: ADD_CARDS_IN_HAND,
        data: data
    };
}

export function updateAllStake(data) {
    return {
        type: UPDATE_ALL_CARDS_IN_STAKE,
        oldStake: data.oldStake,
        stake: data.stake
    };
}

export function updateAllCards(data) {
    return {
        type: UPDATE_ALL_CARDS,
        oldStake: data.oldStake,
        stake: data.stake,
        hand: data.hand
    };
}

const initialState = {
    hand: [],
    stake: [],
    oldStake:[],
    display:['TH','TS','TD','TC']
};

export default function rooms(state = initialState, action) {
    switch (action.type) {
        case ADD_CARDS_IN_HAND:
            return update(state, { hand: { $set: action.data } } );

        case UPDATE_CARDS_IN_STAKE:
            return state.stake === action.data ? state :  update(state, { stake: { $set: action.data } } );

        case UPDATE_CARDS_IN_OLD_STAKE:
            return state.oldStake === action.data ? state : update(state, { oldStake: { $set: action.data } } );

        case UPDATE_ALL_CARDS_IN_STAKE:
            return update(state, {
                oldStake: { $set: action.oldStake },
                stake: { $set: action.stake }
            });

        case UPDATE_ALL_CARDS:
            return update(state, {
                oldStake: { $set: action.oldStake },
                stake: { $set: action.stake },
                hand: { $set: action.hand }
            });

        default:
            return state;
    }
}
