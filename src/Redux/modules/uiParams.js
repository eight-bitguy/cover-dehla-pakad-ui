import update from 'immutability-helper';

const FLASH_CARD = 'FLASH_CARD';
const UPDATE_UI_PARAMS = 'UPDATE_UI_PARAMS';

export function updateFlashCard(data) {
    return {
        type: FLASH_CARD,
        data
    };
}

export function updateUiParams(key, value) {
    return {
        type: UPDATE_UI_PARAMS,
        key,
        value
    };

}

const initialState = {
    flashCard: false,
    displayStats: false
};

export default function uiParams(state = initialState, action) {
    switch (action.type) {
        case FLASH_CARD:
            return update(state, {flashCard: {$set: action.data}});

        case UPDATE_UI_PARAMS:
            return update(state, {[action.key]: {$set: action.value}});

        default:
            return state;
    }
}
