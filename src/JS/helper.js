import {store} from "../index";
import User from "../Models/user";
import {addCardsInHand} from "../Redux/modules/cards";
import {addUser} from "../Redux/modules/users";
import {addUsersInRoom} from "../Redux/modules/roomUsers";
import {getJoinedUses, joinRoom} from "../Api/room";
import {addRoom} from "../Redux/modules/room";
import {batch} from "react-redux";

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
