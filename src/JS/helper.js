import {store} from "../index";
import User from "../Models/user";
import {addCardsInHand} from "../Redux/modules/cards";
import {addUser} from "../Redux/modules/users";
import {addUsersInRoom} from "../Redux/modules/roomUsers";
import {getJoinedUses, joinRoom} from "../Api/room";
import {addRoom} from "../Redux/modules/room";
import {batch} from "react-redux";
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
 * @returns {*}
 */
export function getCurrentRoom() {
    const reduxStore = getStore();
    return reduxStore.room;
}

/**
 *
 * @returns {{}}
 */
function getStore() {
    return store.getState();
}

/**
 *
 * @returns {boolean}
 */
export function isAdmin() {
    const {roomUsers} = getStore();
    const currentRoom = getCurrentRoom();
    const user = getLoggedInUser();

    if (!currentRoom) {
        return false;
    }

    return !!(roomUsers.find(roomUser =>
        +roomUser.userId === user.id &&
        roomUser.position === User.ROOM_USER_POSITION
    ));
}

/**
 *
 * @param card
 */
export function removeCardFromHand(card)
{
    const {cards} = getStore();
    const currentHand = cards.hand;
    currentHand.splice(currentHand.indexOf(card), 1);
    store.dispatch(addCardsInHand(currentHand));
}

/**
 *
 * @returns {*}
 */
export function myPositionInCurrentRoom() {
    const {additionalInfo, roomUsers} = getStore();
    return roomUsers && roomUsers.length ?
        (roomUsers.find(user => +user.userId === +additionalInfo.loggedInUserId).position || '' ): '';
}

/**
 *
 * @returns {boolean}
 */
export function isMyChance() {
    const {additionalInfo} = getStore();
    return additionalInfo.nextChance === myPositionInCurrentRoom();
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
    users.forEach((user, index) => {
        delete users[index]['room_users'];
    });

    await batch(async () => {
        await store.dispatch(addUser(users));
        await store.dispatch(addUsersInRoom(roomUsers));
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

/**
 *
 * @param stake
 * @param nextChance
 * @returns {{}}
 */
export function getPositionCardMapping(stake, nextChance) {
    const mapping = {};
    let positionToCheck = nextChance;

    if (!stake || !nextChance) {
        return mapping;
    }

    stake.reverse();
    stake.forEach((card) => {
        positionToCheck = getPreviousPosition(positionToCheck);
        mapping[positionToCheck] = card;
    });

    return arrangePositionAccordingToThePlayer(mapping);
}

/**
 *
 * @param position
 * @returns {string}
 */
export function getPreviousPosition(position) {
    const positionIndex = Room.ALL_POSITIONS.indexOf(position);
    const previousPositionIndex = (positionIndex + 3) % 4;
    return Room.ALL_POSITIONS[previousPositionIndex];
}

/**
 *
 * @param position
 * @returns {*}
 */
export function getPlayerNameFromPosition(position) {
    const {roomUsers} = getStore();
    if (!roomUsers.length) {
        return '';
    }
    return roomUsers.find(user => user.position === position).name;
}

/**
 *
 * @param mapping
 * @returns {*[]}
 */
export function arrangePositionAccordingToThePlayer(mapping) {
    const myPosition = myPositionInCurrentRoom();
    const offset = Room.ALL_POSITIONS.indexOf(myPosition);

    const arrangedPositions = [
        Room.ALL_POSITIONS[(offset)],
        Room.ALL_POSITIONS[(offset + 1) % 4],
        Room.ALL_POSITIONS[(offset + 2) % 4],
        Room.ALL_POSITIONS[(offset + 3) % 4]
    ];

    return arrangedPositions.map((position) => ({
        position: position,
        card: mapping[position]
    }));
}

/**
 *
 * @param card
 * @returns {string}
 */
export function mapCardToImage(card) {
    const rankMap = {
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

    return `${rankMap[card[0]]}${card[1]}.svg`
}
