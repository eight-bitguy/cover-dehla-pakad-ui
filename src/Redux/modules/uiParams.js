import update from 'immutability-helper';

const FALSH_CARD = 'FALSH_CARD';

export function updateFlashCard(data) {
    return {
        type: FALSH_CARD,
        data
    };
}

const initialState = {
    flashCard: false
};

export default function uiParams(state = initialState, action) {
    switch (action.type) {
        case FALSH_CARD:
            return update(state, {flashCard: {$set: action.data}});

        default:
            return state;
    }
}
