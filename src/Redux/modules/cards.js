import update from 'immutability-helper';
import { PLAY_CARD, UPDATE_NEW_GAME_EVENT } from '../events';

export function playCard(data) {
    return {
        type: PLAY_CARD,
        hand: data.hand,
        stakeWithUser: data.stakeWithUser,
        nextChance: data.nextChance
    };
}

const initialState = {
    hand: [],
    stakeWithUser: [],
    display:['TH','TS','TD','TC']
};

export default function rooms(state = initialState, action) {
    switch (action.type) {
        case UPDATE_NEW_GAME_EVENT:
            return update(state, {
                stakeWithUser: { $set: action.stakeWithUser },
                hand: { $set: action.hand}
            });

        case PLAY_CARD:
            return update(state, {
                hand: { $set: action.hand },
                stakeWithUser: { $set: action.stakeWithUser }                
            });

        default:
            return state;
    }
}
