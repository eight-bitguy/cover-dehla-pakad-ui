// import update from 'immutability-helper';

const UPDATE_STORE = 'UPDATE_STORE';

const initialState = {
    loggedInUserId: null,
    nextChance: null,
    score: {a1: 0, a2: 0, b1: 0, b2: 0},
    dehlaScore: {a1: '', a2: '', b1: '', b2: ''},
    trumpHiddenBy: 'a1',
    trump: null,
    trumpDecidedBy: null,
    roomStatus: null,
    hand: [],
    display:['TH','TS','TD','TC'],
    flashCard: false,
    roomUsers: []
} ;

export default function store(state = initialState, action) {
    switch (action.type) {
        case UPDATE_STORE:
            return action.data;

        default:
            return state;
    }
}
