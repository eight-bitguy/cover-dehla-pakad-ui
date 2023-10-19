import {store} from "../index";
import User from "../Models/user";
import {playCard} from "../Redux/modules/cards";
import {addUser} from "../Redux/modules/users";
import {addUsersInRoom} from "../Redux/modules/roomUsers";
import {getJoinedUses, joinRoom} from "../Api/room";
import {addRoom} from "../Redux/modules/room";
import {batch} from "react-redux";
import { getInitialCards } from "../Api/game";
import { updateOnNewGameEvent } from "../Redux/modules/additionalInfo";
import { replace } from "connected-react-router";
import Url from "./url";
import Room from "../Models/room";

/**
 *
 * @param array1
 * @param array2
 * @param keyAttribute
 * @returns {unknown[]}
 */
export function mergeBasedOnAttribute(array1, array2, keyAttribute) {
    const mergedRecords = {};
    array1.forEach((record) => {
        mergedRecords[record[keyAttribute]] = record;
    });
    array2.forEach((records) => {
        if (mergedRecords[records[keyAttribute]]) {
            mergedRecords[records[keyAttribute]] = {...mergedRecords[records[keyAttribute]], ...records};
        }
        else {
            mergedRecords[records[keyAttribute]] = records;
        }
    });
    return Object.values(mergedRecords);
}

/**
 *
 * @returns {boolean}
 */
export function isLoggedIn() {
    const tokenFromLocalStorage = window.getToken();
    return !!getLoggedInUser() || tokenFromLocalStorage;
}

/**
 *
 * @returns {*}
 */
export function getLoggedInUser() {
    const reduxStore = getStore();
    const { users, additionalInfo } = reduxStore;
    return users.find(user => +user.id === +additionalInfo.loggedInUserId);
}

/**
 *
 * @returns {{}}
 */
export function getStore() {
    return store.getState();
}

/**
 *
 * @returns {boolean}
 */
export function isAdmin() {
    const {roomUsers, room} = getStore();
    const user = getLoggedInUser();

    if (!room) {
        return false;
    }

    return !!(roomUsers.find(roomUser =>
        +roomUser.userId === user.id &&
        roomUser.position === User.ROOM_USER_POSITION
    ));
}

export function sumObjectValues(object) {
    return Object.values(object).reduce((accumulator, value) => {
      return accumulator + value;
    }, 0);
}

export function sumObjectChar(object) {
    return Object.values(object).reduce((accumulator, value) => {
      return accumulator + value.length;
    }, 0);
}
/**
 *
 * @param card
 */
export function moveCardFromHandToStake(card)
{
    const {cards, roomUsers} = getStore();
    const position = roomUsers[0].position;
    
    const currentHand = cards.hand;
    currentHand.splice(currentHand.indexOf(card), 1);

    const newStakeWithUser = Object.assign([], cards.stakeWithUser);
    newStakeWithUser.push([position, card]);

    

    const data = {
        hand: currentHand,
        stakeWithUser: newStakeWithUser,
        nextChance: getNextChance()
    };
    store.dispatch(playCard(data));
}

function getNextChance() {
    const {cards, additionalInfo: {nextChance} } = getStore();
    const nextPlayerPosition = Room.ALL_POSITIONS[(Room.ALL_POSITIONS.indexOf(nextChance) + 1)%4];
    return cards.stakeWithUser.length === 3 ? nextChance : nextPlayerPosition;
}

/**
 *
 * @returns {*}
 */
export function myPositionInCurrentRoom() {
    const {roomUsers} = getStore();

    if (roomUsers.length) {
        return roomUsers[0].position;
    }
    return null;
}

/**
 * Handle new player join event
 * @param {Array} users
 * @returns {Promise<void>}
 */
export async function joinNewUsers(users) {
    const roomUsers = users.map(user => ({
        name: user.name,
        userId: user.id,
        email: user.email,
        position: user['room_users'].data.position,
    }));

    const mappedPlayers = getPlayerPositions(roomUsers)
    users.forEach((user, index) => {
        delete users[index]['room_users'];
    });

    await batch(async () => {
        store.dispatch(addUser(users));
        store.dispatch(addUsersInRoom(mappedPlayers));
    });
}

/**
 * Add already joined users
 * @param roomCode
 * @returns {Promise<void>}
 */
export async function addAlreadyJoinedUsers(roomCode) {
    const { data: joinedUsers } = await getJoinedUses(roomCode);
    await joinNewUsers(joinedUsers);
}

/**
 *
 * @param roomCode
 * @returns {Promise<boolean>}
 */
export async function joinRoomWithRoomCode(roomCode) {
    const response = await joinRoom(roomCode);
    if (!response || !response.data) {
        return false;
    }

    const roomDetails = response.data;
    await store.dispatch(addRoom(roomDetails));

    return true;
}

export function getPlayerPositions(roomUsers) {
    const {additionalInfo:{loggedInUserId}} = getStore();
    if (!roomUsers.length) {
        return [];
    }

    let myIndex = 0;
    while(true) {
        if (roomUsers[myIndex].userId === loggedInUserId) {
            break;
        }
        myIndex = (myIndex + 1)%4;
    }
    const playerPositions = [];
    for (let i = 0; i < roomUsers.length; i++) {
        playerPositions[i] = roomUsers[(myIndex+i)%4];
    }
    return playerPositions;
}

/**
 *
 * @type {{A: string, J: string, K: string, Q: string, "2": string, "3": string, "4": string, T: string, "5": string, "6": string, "7": string, "8": string, "9": string}}
 */
export const rankMap = {
    'A': 'A',
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5',
    '6': '6',
    '7': '7',
    '8': '8',
    '9': '9',
    'T': '10',
    'J': 'J',
    'Q': 'Q',
    'K': 'K'
};

export function canOpenTrump() {
    const {additionalInfo, cards} = getStore();
    if (additionalInfo.trumpDecidedBy) {
        return false;
    }
    if (cards.stakeWithUser.length) {
        const baseDeck = cards.stakeWithUser[0][1].charAt(1);
        const hand = cards.hand;
        const hasNoCardsOfChance = hand.every(card => card[1] !== baseDeck);
        const myPosition = myPositionInCurrentRoom();

        return hasNoCardsOfChance 
        && additionalInfo.trumpHiddenBy !== myPosition
        && myPosition === additionalInfo.nextChance;
    }
    return false;
}

export async function fetchAndStoreInitialData(dispatch) {
    const data = await getInitialCards(window.getRoomCode());

    if (!data) {
        dispatch(replace(Url.LandingPage));
        return;
    }

    await batch(async () => {
        dispatch(updateOnNewGameEvent(data));
    });
}